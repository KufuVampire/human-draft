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

	private async countCommentsToDelete(
		tx: {
			comment: {
				findMany: (args: {
					where: { parentId: { in: string[] } };
					select: { id: true };
				}) => Promise<{ id: string }[]>;
			};
		},
		rootCommentId: string
	): Promise<number> {
		let count = 1;
		let currentIds = [rootCommentId];
		while (currentIds.length > 0) {
			const children = await tx.comment.findMany({
				where: { parentId: { in: currentIds } },
				select: { id: true },
			});
			count += children.length;
			currentIds = children.map((c) => c.id);
		}
		return count;
	}

	async create(
		authorId: string,
		postId: string,
		text: string,
		parentId?: string
	) {
		const post = await this.prismaService.post.findUnique({
			where: { id: postId },
		});

		if (!post) {
			throw new NotFoundException('Post not found');
		}

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

		return this.prismaService.$transaction(async (tx) => {
			const comment = await tx.comment.create({
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
				include: {
					author: true,
				},
			});

			await tx.post.update({
				where: { id: postId },
				data: {
					commentsCount: {
						increment: 1,
					},
				},
			});

			return comment;
		});
	}

	async update(authorId: string, commentId: string, text: string) {
		const comment = await this.prismaService.comment.findUnique({
			where: { id: commentId },
		});

		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		if (comment.authorId !== authorId) {
			throw new ForbiddenException(
				'Comment not found or you have no permission to update it'
			);
		}

		await this.prismaService.comment.update({
			where: {
				id: commentId,
			},
			data: {
				text,
			},
		});

		return true;
	}

	async delete(authorId: string, commentId: string) {
		const comment = await this.prismaService.comment.findUnique({
			where: { id: commentId },
		});

		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		if (comment.authorId !== authorId) {
			throw new ForbiddenException(
				'This is not your comment, it cannot be deleted.'
			);
		}

		await this.prismaService.$transaction(async (tx) => {
			const totalDeleted = await this.countCommentsToDelete(tx, commentId);

			await tx.comment.delete({
				where: { id: commentId },
			});

			if (comment.postId) {
				await tx.post.update({
					where: { id: comment.postId },
					data: {
						commentsCount: {
							decrement: totalDeleted,
						},
					},
				});
			}
		});

		return true;
	}

	async allPostComments(postId: string) {
		const comments = await this.prismaService.comment.findMany({
			where: {
				postId,
				parentId: null,
			},
			include: {
				author: true,
			},
		});

		return comments;
	}
}
