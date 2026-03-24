import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import * as sharp from 'sharp';

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

		const freePosts = await this.prismaService.post.findMany({
			where: {
				id: { in: postIds },
				blogId: null,
			},
			select: { id: true },
		});

		const blog = await this.prismaService.blog.create({
			data: {
				title,
				description,
				author: {
					connect: {
						id: authorId,
					},
				},
				...(postIds.length && {
					posts: { connect: freePosts.map(({ id }) => ({ id })) },
				}),
				...(tags && {
					tags: {
						connectOrCreate: tags.map((tag) => ({
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
		const chunks: Buffer[] = [];

		for await (const chunk of posterFile.createReadStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);
		const fileName = `blogs/${blog.id}-poster.webp`;
		if (posterFile.filename && posterFile.filename.startsWith('.gif')) {
			throw new UnsupportedMediaTypeException('Unsupported file type');
		}

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
		const { description, postIds, title, tags } = input;

		const blog = await this.prismaService.blog.update({
			where: {
				id: blogId,
				authorId,
			},
			data: {
				description,
				title,
				...(postIds &&
					postIds.length && {
						posts: { connect: postIds.map((id) => ({ id })) },
					}),
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

		if (!posterFile) {
			return true;
		}

		const chunks: Buffer[] = [];

		for await (const chunk of posterFile.createReadStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);
		const fileName = `blogs/${blog.id}-poster.webp`;
		if (posterFile.filename && posterFile.filename.startsWith('.gif')) {
			throw new UnsupportedMediaTypeException('Unsupported file type');
		}

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
			throw new ConflictException('You are not an author of this blog');
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
		searchParams: SearchParamsInput,
		filters?: FiltersInput,
		user?: UserModel
	) {
		const { page = PAGINATION_PAGE, perPage = PAGINATION_PER_PAGE } =
			searchParams;

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
				orderBy: { id: 'asc' },
				include: {
					author: true,
					tags: true,
				},
			}),
			this.prismaService.blog.count(),
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

		if (blog.posterUrl) {
			await this.storageService.remove(`blogs/${blog.id}-poster.webp`);
		}

		if (!newPoster) {
			throw new BadRequestException('The file was not transferred');
		}

		const chunks: Buffer[] = [];

		for await (const chunk of newPoster.createReadStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);

		const newPosterKey = `blogs/${blog.id}-poster.webp`;
		if (newPoster.filename && newPoster.filename.startsWith('.gif')) {
			throw new UnsupportedMediaTypeException('Unsupported file type');
		}

		const processesBuffer = await sharp(buffer)
			.resize(950, 330)
			.webp()
			.toBuffer();

		await this.storageService.uploadForProfile(
			processesBuffer,
			newPosterKey,
			'image/webp'
		);

		const newPosterUrl = this.storageService.getFileUrl(newPosterKey);
		await this.prismaService.blog.update({
			where: {
				id: blogId,
			},
			data: {
				posterUrl: newPosterUrl,
			},
		});

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

		await this.storageService.remove(`blogs/${blog.id}-poster.webp`);
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
