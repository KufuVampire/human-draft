import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePostInput, UpdatePostInput } from '@/src/inputs';

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

	async pin(authorId: string, postId: string, blogId: string) {
		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post || post.authorId !== authorId) {
			throw new NotFoundException(
				'Cannot be pinned. Post not found or not author'
			);
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

	async unPin(authorId: string, postId: string, blogId: string) {
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
}
