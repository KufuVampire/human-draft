import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { AwsStorageService } from '../aws-storage/aws-storage.service';
import { PrismaService } from '../prisma/prisma.service';

import { MediaStatus } from '@/prisma/generated/enums';
import { PostWhereInput } from '@/prisma/generated/models';
import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '@/src/consts';
import {
	CreatePostInput,
	FiltersInput,
	SearchParamsInput,
	UpdatePostInput,
} from '@/src/inputs';
import { UserModel } from '@/src/models';
import { extractMediaKeysFromContent, sanitizeTags } from '@/src/utils';

@Injectable()
export class PostService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storage: AwsStorageService
	) {}

	async create(authorId: string, input: CreatePostInput, blogId?: string) {
		const { content, title, tags } = input;
		const sanitizedTags = sanitizeTags(tags);

		const post = await this.prismaService.post.create({
			data: {
				title,
				content,
				author: {
					connect: {
						id: authorId,
					},
				},
				...(sanitizedTags &&
					sanitizedTags.length > 0 && {
						tags: {
							connectOrCreate: sanitizedTags.map((tag) => ({
								where: { name: tag },
								create: { name: tag },
							})),
						},
					}),
				...(blogId && {
					blog: {
						connect: { id: blogId },
					},
				}),
			},
		});

		const mediaKeys = extractMediaKeysFromContent(content, this.storage);
		if (mediaKeys.length > 0) {
			await this.prismaService.mediaAttachment.updateMany({
				where: {
					key: { in: mediaKeys },
					authorId,
					status: MediaStatus.PENDING,
				},
				data: {
					postId: post.id,
					status: MediaStatus.ATTACHED,
				},
			});
		}

		return post;
	}

	async update(authorId: string, postId: string, input: UpdatePostInput) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		if (post.authorId !== authorId) {
			throw new ForbiddenException('You are not the author of this post');
		}

		const { content, title, tags } = input;
		const sanitizedTags = sanitizeTags(tags);

		await this.prismaService.post.update({
			where: {
				id: postId,
			},
			data: {
				title,
				content,
				...(sanitizedTags && {
					tags: {
						set: [],
						connectOrCreate: sanitizedTags.map((tag) => ({
							where: { name: tag },
							create: { name: tag },
						})),
					},
				}),
			},
		});

		if (content !== undefined) {
			const currentAttachments =
				await this.prismaService.mediaAttachment.findMany({
					where: { postId },
					select: { id: true, key: true },
				});

			const newKeys = new Set(
				extractMediaKeysFromContent(content, this.storage)
			);

			const removedAttachments = currentAttachments.filter(
				(attachment) => !newKeys.has(attachment.key)
			);

			if (removedAttachments.length > 0) {
				await this.storage.removeMany(
					removedAttachments.map((attachment) => attachment.key)
				);
				await this.prismaService.mediaAttachment.deleteMany({
					where: {
						id: {
							in: removedAttachments.map((attachment) => attachment.id),
						},
					},
				});
			}

			const currentKeySet = new Set(
				currentAttachments.map((attachment) => attachment.key)
			);
			const newlyAddedKeys = Array.from(newKeys).filter(
				(key) => !currentKeySet.has(key)
			);

			if (newlyAddedKeys.length > 0) {
				await this.prismaService.mediaAttachment.updateMany({
					where: {
						key: { in: newlyAddedKeys },
						authorId,
						status: MediaStatus.PENDING,
					},
					data: {
						postId,
						status: MediaStatus.ATTACHED,
					},
				});
			}
		}

		return true;
	}

	async delete(authorId: string, postId: string) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		if (post.authorId !== authorId) {
			throw new ForbiddenException('You are not the author of this post');
		}

		const attachments = await this.prismaService.mediaAttachment.findMany({
			where: { postId },
			select: { key: true },
		});

		if (attachments.length > 0) {
			await this.storage.removeMany(attachments.map((a) => a.key));
		}

		await this.prismaService.post.delete({
			where: {
				id: postId,
			},
		});
	}

	async pinPostToBlog(authorId: string, postId: string, blogId: string) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) {
			throw new NotFoundException('Cannot be pinned. Post not found');
		}

		if (post.authorId !== authorId) {
			throw new ForbiddenException('You are not the author of this post');
		}

		if (post.blogId === blogId) {
			throw new ConflictException(
				`Post already pinned to this blog - ${blogId}`
			);
		}

		const blog = await this.prismaService.blog.findUnique({
			where: { id: blogId },
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		if (blog.authorId !== authorId) {
			throw new ForbiddenException('You are not the author of this blog');
		}

		return this.prismaService.post.update({
			where: {
				id: postId,
			},
			data: {
				blog: {
					connect: {
						id: blogId,
					},
				},
			},
			include: {
				author: true,
				tags: true,
			},
		});
	}

	async unPinPostFromBlog(authorId: string, postId: string, blogId: string) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		if (post.authorId !== authorId) {
			throw new ForbiddenException('You are not the author of this post');
		}

		const blog = await this.prismaService.blog.findUnique({
			where: { id: blogId },
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		if (blog.authorId !== authorId) {
			throw new ForbiddenException('You are not the author of this blog');
		}

		if (post.blogId !== blogId) {
			throw new ConflictException(
				`Post is not pinned to this blog - ${blogId}`
			);
		}

		await this.prismaService.post.update({
			where: {
				id: postId,
			},
			data: {
				blog: {
					disconnect: true,
				},
			},
		});
	}

	async getPostById(id: string) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id,
			},
			include: {
				author: true,
				blog: true,
				tags: true,
				_count: {
					select: {
						comments: true,
					},
				},
			},
		});

		if (!post) {
			throw new NotFoundException('Post was not found');
		}

		return {
			...post,
			commentsCount: post._count.comments,
		};
	}

	async getAllPosts(
		searchParams: SearchParamsInput = {},
		filters?: FiltersInput,
		user?: UserModel
	) {
		const { page = PAGINATION_PAGE, perPage = PAGINATION_PER_PAGE } =
			searchParams ?? {};

		const skip = (page - 1) * perPage;

		const where: PostWhereInput = {
			...(filters?.search && {
				title: {
					contains: filters?.search,
					mode: 'insensitive',
				},
			}),
			...(filters?.onlySubscriptions &&
				user && {
					author: {
						subscribers: {
							some: {
								fromUserId: user.id,
							},
						},
					},
				}),
		};

		const [posts, totalCount] = await this.prismaService.$transaction([
			this.prismaService.post.findMany({
				where,
				take: perPage,
				skip,
				orderBy: { createdAt: 'desc' },
				include: {
					author: true,
					tags: true,
				},
			}),
			this.prismaService.post.count({ where }),
		]);

		return {
			data: posts,
			totalCount,
			page,
			perPage,
			totalPages: Math.ceil(totalCount / perPage),
		};
	}

	async getAllFreeUserPostsForPin(userId: string, searchStr?: string) {
		const posts = await this.prismaService.post.findMany({
			where: {
				author: {
					id: userId,
				},
				blogId: null,
				title: {
					contains: searchStr,
					mode: 'insensitive',
				},
			},
		});

		return posts;
	}
}
