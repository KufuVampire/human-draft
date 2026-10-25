import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
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

	async updateTags(
		authorId: string,
		tags: string[],
		to: UpdatePostOrBlogTagsInput
	) {
		const { postId, blogId } = to;

		if ((!postId && !blogId) || (postId && blogId)) {
			throw new BadRequestException(
				'Either postId or blogId must be provided, but not both'
			);
		}

		const uniqueTags = [
			...new Set(
				tags
					.map((tag) => normalizeTagName(tag))
					.filter((tag) => tag.length > 0 && tag.length <= 50)
			),
		].slice(0, 10);

		if (postId) {
			const post = await this.prismaService.post.findUnique({
				where: {
					id: postId,
				},
			});

			if (!post) {
				throw new NotFoundException('Post not found');
			}

			if (post.authorId !== authorId) {
				throw new ForbiddenException(
					'You are not the author of this post'
				);
			}

			await this.prismaService.post.update({
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

			return true;
		}

		if (blogId) {
			const blog = await this.prismaService.blog.findUnique({
				where: {
					id: blogId,
				},
			});

			if (!blog) {
				throw new NotFoundException('Blog not found');
			}

			if (blog.authorId !== authorId) {
				throw new ForbiddenException(
					'You are not the author of this blog'
				);
			}

			await this.prismaService.blog.update({
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

			return true;
		}

		return false;
	}

	async findTags(search: string) {
		return await this.prismaService.tag.findMany({
			where: {
				name: {
					contains: search,
					mode: 'insensitive',
				},
			},
		});
	}
}
