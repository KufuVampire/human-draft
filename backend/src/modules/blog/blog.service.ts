import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBlogInput, UpdateBlogInput } from '@/src/inputs';

@Injectable()
export class BlogService {
	constructor(private readonly prismaService: PrismaService) {}

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
}
