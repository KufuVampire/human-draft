import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { PostService } from '../post/post.service';
import { PrismaService } from '../prisma/prisma.service';

import { CreateBlogInput, UpdateBlogInput } from '@/src/inputs';

@Injectable()
export class BlogService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly postService: PostService
	) {}

	private async findBlogById(id: string) {
		const blog = await this.prismaService.blog.findUnique({
			where: {
				id,
			},
		});

		if (!blog) {
			throw new NotFoundException(`Blog not found - ${id}`);
		}

		return blog;
	}

	async create(authorId: string, input: CreateBlogInput) {
		const blog = await this.prismaService.blog.create({
			data: {
				...input,
				author: {
					connect: {
						id: authorId,
					},
				},
				posts: input.postIds.length
					? { connect: input.postIds.map((id) => ({ id })) }
					: undefined,
			},
		});

		return blog;
	}

	async update(authorId: string, blogId: string, input: UpdateBlogInput) {
		const blog = await this.prismaService.blog.update({
			where: {
				id: blogId,
				authorId,
			},
			data: input,
		});

		return blog;
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

		await this.prismaService.blog.delete({
			where: {
				id: blogId,
				authorId,
			},
		});

		return true;
	}

	async pinPostsToBlog(authorId: string, blogId: string, postIds: string[]) {
		if (postIds.length === 0) {
			throw new BadRequestException('No posts provided to pin');
		}

		for (const postId of postIds) {
			await this.postService.pinPostToBlog(authorId, postId, blogId);
		}

		return this.findBlogById(blogId);
	}

	async unPinPostsFromBlog(
		authorId: string,
		blogId: string,
		postIds: string[]
	) {
		if (postIds.length === 0) {
			throw new BadRequestException('No posts provided to unpin');
		}

		for (const postId of postIds) {
			await this.postService.unPinPostFromBlog(authorId, postId, blogId);
		}

		return this.findBlogById(blogId);
	}

	async getAllBlogs(searchParams: { perPage?: number; page?: number }) {
		const { page = 1, perPage = 5 } = searchParams;

		const skip = (page - 1) * perPage;

		const [blogs, totalCount] = await this.prismaService.$transaction([
			this.prismaService.blog.findMany({
				take: perPage,
				skip,
				orderBy: { id: 'asc' },
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
}
