import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import sharp from 'sharp';

import { AwsStorageService } from '../aws-storage/aws-storage.service';
import { PostService } from '../post/post.service';
import { PrismaService } from '../prisma/prisma.service';

import { BlogWhereInput } from '@/prisma/generated/models';
import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '@/src/consts';
import {
	CreateBlogInput,
	FiltersInput,
	SearchParamsInput,
	UpdateBlogInput,
} from '@/src/inputs';
import { UserModel } from '@/src/models';
import { readStreamWithLimit, sanitizeTags, validateNoGif } from '@/src/utils';

@Injectable()
export class BlogService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly postService: PostService,
		private readonly storageService: AwsStorageService
	) {}

	async create(
		authorId: string,
		input: CreateBlogInput,
		posterFile?: FileUpload
	) {
		const { postIds, tags, title, description } = input;

		const freePosts =
			postIds && postIds.length
				? await this.prismaService.post.findMany({
						where: {
							id: { in: postIds },
							blogId: null,
							authorId,
						},
						select: { id: true },
				  })
				: [];

		const sanitizedTags = sanitizeTags(tags);

		const blog = await this.prismaService.blog.create({
			data: {
				title,
				description,
				author: {
					connect: {
						id: authorId,
					},
				},
				...(freePosts.length > 0 && {
					posts: { connect: freePosts.map(({ id }) => ({ id })) },
				}),
				...(sanitizedTags &&
					sanitizedTags.length > 0 && {
						tags: {
							connectOrCreate: sanitizedTags.map((tag) => ({
								where: { name: tag },
								create: { name: tag },
							})),
						},
					}),
			},
		});

		if (!posterFile) {
			return blog;
		}

		validateNoGif(posterFile.filename, posterFile.mimetype);

		const buffer = await readStreamWithLimit(posterFile.createReadStream());
		const fileName = `blogs/${blog.id}-poster.webp`;

		const processesBuffer = await sharp(buffer)
			.resize(950, 330)
			.webp()
			.toBuffer();

		await this.storageService.uploadForProfile(
			processesBuffer,
			fileName,
			'image/webp'
		);
		const posterUrl = this.storageService.getFileUrl(fileName);
		return this.prismaService.blog.update({
			where: {
				id: blog.id,
			},
			data: {
				posterUrl,
			},
		});
	}

	async update(
		authorId: string,
		blogId: string,
		input: UpdateBlogInput,
		posterFile?: FileUpload
	) {
		const blog = await this.prismaService.blog.findUnique({
			where: { id: blogId },
		});

		if (!blog) {
			throw new NotFoundException('Blog was not found');
		}

		if (blog.authorId !== authorId) {
			throw new ForbiddenException('You are not the author of this blog');
		}

		const { description, postIds, title, tags } = input;

		const freePosts =
			postIds && postIds.length
				? await this.prismaService.post.findMany({
						where: {
							id: { in: postIds },
							authorId,
							OR: [{ blogId: null }, { blogId }],
						},
						select: { id: true },
				  })
				: [];

		const sanitizedTags = sanitizeTags(tags);

		await this.prismaService.blog.update({
			where: {
				id: blogId,
			},
			data: {
				description,
				title,
				...(freePosts.length > 0 && {
					posts: { connect: freePosts.map(({ id }) => ({ id })) },
				}),
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

		if (!posterFile) {
			return true;
		}

		validateNoGif(posterFile.filename, posterFile.mimetype);

		const buffer = await readStreamWithLimit(posterFile.createReadStream());
		const fileName = `blogs/${blog.id}-poster.webp`;

		const processesBuffer = await sharp(buffer)
			.resize(950, 330)
			.webp()
			.toBuffer();

		await this.storageService.uploadForProfile(
			processesBuffer,
			fileName,
			'image/webp'
		);
		const posterUrl = this.storageService.getFileUrl(fileName);
		await this.prismaService.blog.update({
			where: {
				id: blog.id,
			},
			data: {
				posterUrl,
			},
		});

		return true;
	}

	async delete(authorId: string, blogId: string) {
		const isExists = await this.prismaService.blog.findUnique({
			where: {
				id: blogId,
			},
		});

		if (!isExists) {
			throw new NotFoundException('Blog was not found');
		}

		if (isExists.authorId !== authorId) {
			throw new ForbiddenException('You are not the author of this blog');
		}

		await this.prismaService.blog.delete({
			where: {
				id: blogId,
				author: {
					id: authorId,
				},
			},
		});

		return true;
	}

	async pinPostToBlog(authorId: string, blogId: string, postId: string) {
		return this.postService.pinPostToBlog(authorId, postId, blogId);
	}

	async unPinPostFromBlog(authorId: string, blogId: string, postId: string) {
		await this.postService.unPinPostFromBlog(authorId, postId, blogId);
	}

	async getAllBlogs(
		searchParams: SearchParamsInput = {},
		filters?: FiltersInput,
		user?: UserModel
	) {
		const { page = PAGINATION_PAGE, perPage = PAGINATION_PER_PAGE } =
			searchParams ?? {};

		const skip = (page - 1) * perPage;

		const where: BlogWhereInput = {
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

		const [blogs, totalCount] = await this.prismaService.$transaction([
			this.prismaService.blog.findMany({
				where,
				take: perPage,
				skip,
				orderBy: { createdAt: 'desc' },
				include: {
					author: true,
					tags: true,
				},
			}),
			this.prismaService.blog.count({ where }),
		]);

		return {
			data: blogs,
			totalCount,
			page,
			perPage,
			totalPages: Math.ceil(totalCount / perPage),
		};
	}

	async getBlog(blogId: string) {
		const blog = await this.prismaService.blog.findUnique({
			where: {
				id: blogId,
			},
			include: {
				author: true,
				tags: true,
				posts: {
					include: {
						author: true,
						tags: true,
					},
				},
			},
		});

		if (!blog) {
			throw new NotFoundException('Blog was not found');
		}

		return blog;
	}

	async blogsForPin(userId: string) {
		return this.prismaService.blog.findMany({
			where: {
				author: {
					id: userId,
				},
			},
		});
	}

	async changePoster(authorId: string, blogId: string, newPoster: FileUpload) {
		const blog = await this.prismaService.blog.findUnique({
			where: {
				id: blogId,
				author: {
					id: authorId,
				},
			},
		});

		if (!blog) {
			throw new NotFoundException('Blog was not found');
		}

		if (!newPoster) {
			throw new BadRequestException('The file was not transferred');
		}

		validateNoGif(newPoster.filename, newPoster.mimetype);

		const buffer = await readStreamWithLimit(newPoster.createReadStream());

		const newPosterKey = `blogs/${blog.id}-poster.webp`;

		const processesBuffer = await sharp(buffer)
			.resize(950, 330)
			.webp()
			.toBuffer();

		await this.storageService.uploadForProfile(
			processesBuffer,
			newPosterKey,
			'image/webp'
		);

		const oldPosterUrl = blog.posterUrl;
		const newPosterUrl = this.storageService.getFileUrl(newPosterKey);
		await this.prismaService.blog.update({
			where: {
				id: blogId,
			},
			data: {
				posterUrl: newPosterUrl,
			},
		});

		if (oldPosterUrl && oldPosterUrl !== newPosterUrl) {
			await this.storageService.remove(oldPosterUrl);
		}

		return true;
	}

	async deletePoster(authorId: string, blogId: string) {
		const blog = await this.prismaService.blog.findUnique({
			where: {
				id: blogId,
				author: {
					id: authorId,
				},
			},
		});

		if (!blog) {
			throw new NotFoundException('Blog was not found');
		}

		if (blog.posterUrl) {
			await this.storageService.remove(blog.posterUrl);
		}

		await this.prismaService.blog.update({
			where: {
				id: blogId,
			},
			data: {
				posterUrl: null,
			},
		});
		return true;
	}
}
