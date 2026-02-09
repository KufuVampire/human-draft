import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { UpdatePostOrBlogTagsInput } from '@/src/inputs';
import { normalizeTagName } from '@/src/utils';

@Injectable()
export class TagService {
	constructor(private readonly prismaService: PrismaService) {}

	async findByName(name: string) {
		return this.prismaService.tag.findUnique({
			where: {
				name,
			},
		});
	}

	async create(name: string) {
		const isExists = await this.findByName(normalizeTagName(name));

		if (isExists) {
			throw new ConflictException('Tag is already exists');
		}

		const tag = await this.prismaService.tag.create({
			data: {
				name,
			},
		});

		return tag;
	}

	async delete(name: string) {
		const isExists = await this.findByName(normalizeTagName(name));

		if (!isExists) {
			throw new NotFoundException('Tag was not found');
		}

		await this.prismaService.tag.delete({
			where: {
				name,
			},
		});

		return true;
	}

	async updateTags(tags: string[], to: UpdatePostOrBlogTagsInput) {
		const { postId, blogId } = to;

		if (postId) {
			const post = await this.prismaService.post.findUnique({
				where: {
					id: postId,
				},
			});

			if (!post) {
				throw new NotFoundException('Post not found');
			}

			const uniqueTags = [...new Set(tags)];

			return this.prismaService.post.update({
				where: {
					id: postId,
				},
				data: {
					tags: {
						set: [],
						connectOrCreate: uniqueTags.map((tag) => ({
							where: { name: tag },
							create: { name: tag },
						})),
					},
				},
			});
		}

		if (blogId) {
			const blog = await this.prismaService.blog.findUnique({
				where: {
					id: blogId,
				},
			});

			if (!blog) {
				throw new NotFoundException('Post not found');
			}

			const uniqueTags = [...new Set(tags)];

			return this.prismaService.blog.update({
				where: {
					id: blogId,
				},
				data: {
					tags: {
						set: [],
						connectOrCreate: uniqueTags.map((tag) => ({
							where: { name: tag },
							create: { name: tag },
						})),
					},
				},
			});
		}
	}

	async findTags(search: string) {
		return await this.prismaService.tag.findMany({
			where: {
				name: {
					contains: search,
					mode: 'insensitive'
				},
			},
		});
	}
}
