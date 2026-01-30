import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '@/src/consts';
import {
	CreatePostInput,
	SearchParamsInput,
	UpdatePostInput,
} from '@/src/inputs';

@Injectable()
export class PostService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(authorId: string, input: CreatePostInput, blogId?: string) {
		return this.prismaService.post.create({
			data: {
				...input,
				author: {
					connect: {
						id: authorId,
					},
				},
				...(blogId && {
					blog: {
						connect: { id: blogId },
					},
				}),
			},
		});
	}

	async update(authorId: string, postId: string, input: UpdatePostInput) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post || post.authorId !== authorId) {
			throw new NotFoundException('Post not found or you are not the author');
		}

		return this.prismaService.post.update({
			where: {
				id: postId,
			},
			data: {
				...input,
			},
		});
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
				id
			},
			include: {
				author: true,
				blog: true,
				comments: true,
				tags: true
			}
		})

		if (!post) {
			throw new NotFoundException('Post was not found');
		}

		return post;
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
