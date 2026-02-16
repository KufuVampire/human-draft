import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { AwsStorageService } from '../aws-storage/aws-storage.service';
import { PrismaService } from '../prisma/prisma.service';

import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '@/src/consts';
import {
	CreatePostInput,
	SearchParamsInput,
	UpdatePostInput,
} from '@/src/inputs';

@Injectable()
export class PostService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storage: AwsStorageService
	) {}

	async create(authorId: string, input: CreatePostInput, blogId?: string) {
		const { content, title, tags } = input;

		return this.prismaService.post.create({
			data: {
				title,
				content,
				author: {
					connect: {
						id: authorId,
					},
				},
				...(tags && {
					tags: {
						connectOrCreate: tags.map((tag) => ({
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
			include: {
				author: true,
				blog: true,
				tags: true,
			},
		});
	}

	async update(authorId: string, postId: string, input: UpdatePostInput) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) {
			throw new NotFoundException('Post not found or you are not the author');
		}

		const { content, title, tags, likesCount, viewsCount } = input;

		await this.prismaService.post.update({
			where: {
				id: postId,
			},
			data: {
				title,
				content,
				likesCount,
				viewsCount,
				...(tags && {
					tags: {
						set: [],
						connectOrCreate: tags.map((tag) => ({
							where: { name: tag },
							create: { name: tag },
						})),
					},
				}),
			},
		});

		return true;
	}

	async delete(authorId: string, postId: string) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post || post.authorId !== authorId) {
			throw new NotFoundException('Post not found or you are not the author');
		}

		const removeImages = async (nodes: any[]) => {
			for (const node of nodes) {
				if (node.type === 'image' && node.attrs?.src) {
					await this.storage.remove(node.attrs.src);
				}
				if (Array.isArray(node.content)) {
					await removeImages(node.content);
				}
			}
		};

		if (post.content && typeof post.content === 'object') {
			if (Array.isArray((post.content as any).content)) {
				await removeImages((post.content as any).content);
			} else if (Array.isArray(post.content)) {
				await removeImages(post.content);
			}
		}

		await this.prismaService.post.delete({
			where: {
				id: postId,
			},
		});

		return true;
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
		});
	}

	async unPinPostFromBlog(authorId: string, postId: string, blogId: string) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post || post.authorId !== authorId) {
			throw new NotFoundException('Post not found or you are not the author');
		}

		if (post.blogId !== blogId) {
			throw new ConflictException(
				`Post is not pinned to this blog - ${blogId}`
			);
		}

		const blog = await this.prismaService.blog.findUnique({
			where: { id: blogId },
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		return this.prismaService.post.update({
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
				comments: {
					where: {
						parentId: null,
					},
					include: {
						author: true,
					},
				},
				tags: true,
				_count: {
					select: {
						comments: true
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

	async getAllPosts(searchParams: SearchParamsInput) {
		const { page = PAGINATION_PAGE, perPage = PAGINATION_PER_PAGE } =
			searchParams;

		const skip = (page - 1) * perPage;

		const [posts, totalCount] = await this.prismaService.$transaction([
			this.prismaService.post.findMany({
				take: perPage,
				skip,
				orderBy: { id: 'asc' },
				include: {
					author: true,
					tags: true,
				},
			}),
			this.prismaService.post.count(),
		]);

		return {
			data: posts,
			totalCount,
			page,
			perPage,
			totalPages: Math.ceil(totalCount / perPage),
		};
	}
}
