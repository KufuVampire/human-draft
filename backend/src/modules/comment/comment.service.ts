import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(
		authorId: string,
		postId: string,
		text: string,
		parentId?: string
	) {
		if (parentId) {
			const parent = await this.prismaService.comment.findUnique({
				where: { id: parentId },
			});

			if (!parent) {
				throw new NotFoundException('Parent comment not found');
			}

			if (parent.postId !== postId) {
				throw new BadRequestException(
					'Parent comment does not belong to this post'
				);
			}
		}

		return this.prismaService.comment.create({
			data: {
				text,
				author: {
					connect: {
						id: authorId,
					},
				},
				post: {
					connect: {
						id: postId,
					},
				},
				...(parentId && {
					parent: {
						connect: {
							id: parentId,
						},
					},
				}),
			},
		});
	}

	async update(authorId: string, commentId: string, text: string) {
		const result = await this.prismaService.comment.updateMany({
			where: {
				id: commentId,
				authorId,
			},
			data: {
				text,
			},
		});

		if (result.count === 0) {
			// либо не существует, либо не автор
			throw new ForbiddenException(
				'Comment not found or you have no permission to update it'
			);
		}

		return this.prismaService.comment.findUnique({
			where: { id: commentId },
		});
	}

	async delete(authorId: string, commentId: string) {
		const comment = await this.prismaService.comment.findUnique({
			where: { id: commentId },
			include: {
				replies: true,
			},
		});

		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		if (comment.authorId !== authorId) {
			throw new ForbiddenException(
				'This is not your comment, it cannot be deleted.'
			);
		}

		await this.prismaService.comment.delete({
			where: { id: commentId },
		});

		return true;
	}
}
