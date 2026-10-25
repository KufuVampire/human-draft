import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { CommentService } from './comment.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CommentService', () => {
	describe('create', () => {
		it('выбрасывает BadRequestException, если текст пустой или состоит из пробелов', async () => {
			const mockPrisma = {} as unknown as PrismaService;
			const service = new CommentService(mockPrisma);

			await expect(
				service.create('author-1', 'post-1', '   ')
			).rejects.toThrow(new BadRequestException('Comment text cannot be empty'));

			await expect(
				service.create('author-1', 'post-1', '')
			).rejects.toThrow(new BadRequestException('Comment text cannot be empty'));
		});

		it('выбрасывает BadRequestException, если длина текста превышает 2000 символов', async () => {
			const mockPrisma = {} as unknown as PrismaService;
			const service = new CommentService(mockPrisma);

			const longText = 'a'.repeat(2001);

			await expect(
				service.create('author-1', 'post-1', longText)
			).rejects.toThrow(
				new BadRequestException('Comment text cannot exceed 2000 characters')
			);
		});

		it('выбрасывает NotFoundException, если пост не найден', async () => {
			const mockPrisma = {
				post: {
					findUnique: vi.fn().mockResolvedValue(null),
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			await expect(
				service.create('author-1', 'post-1', 'Test text')
			).rejects.toThrow(NotFoundException);
		});

		it('выбрасывает NotFoundException, если parentId передан, но родительский комментарий не найден', async () => {
			const mockPrisma = {
				post: {
					findUnique: vi.fn().mockResolvedValue({ id: 'post-1' }),
				},
				comment: {
					findUnique: vi.fn().mockResolvedValue(null),
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			await expect(
				service.create('author-1', 'post-1', 'Test text', 'non-existent-parent')
			).rejects.toThrow(NotFoundException);
		});

		it('выбрасывает BadRequestException, если parentId принадлежит другому посту', async () => {
			const mockPrisma = {
				post: {
					findUnique: vi.fn().mockResolvedValue({ id: 'post-1' }),
				},
				comment: {
					findUnique: vi.fn().mockResolvedValue({
						id: 'parent-1',
						postId: 'different-post-id',
					}),
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			await expect(
				service.create('author-1', 'post-1', 'Test text', 'parent-1')
			).rejects.toThrow(BadRequestException);
		});

		it('создает корневой комментарий с trimmed текстом и инкрементирует commentsCount у поста', async () => {
			const createdComment = {
				id: 'comment-1',
				text: 'Hello world',
				authorId: 'author-1',
				postId: 'post-1',
				parentId: null,
			};

			const mockCommentCreate = vi.fn().mockResolvedValue(createdComment);
			const mockPostUpdate = vi.fn().mockResolvedValue({ id: 'post-1' });

			const mockPrisma = {
				post: {
					findUnique: vi.fn().mockResolvedValue({ id: 'post-1' }),
				},
				$transaction: vi.fn().mockImplementation((callback) => {
					return callback({
						comment: { create: mockCommentCreate },
						post: { update: mockPostUpdate },
					});
				}),
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			const result = await service.create(
				'author-1',
				'post-1',
				'   Hello world   '
			);

			expect(result).toEqual(createdComment);
			expect(mockCommentCreate).toHaveBeenCalledWith({
				data: {
					text: 'Hello world',
					author: { connect: { id: 'author-1' } },
					post: { connect: { id: 'post-1' } },
				},
				include: { author: true },
			});
			expect(mockPostUpdate).toHaveBeenCalledWith({
				where: { id: 'post-1' },
				data: { commentsCount: { increment: 1 } },
			});
		});

		it('создает дочерний комментарий (reply) с привязкой parent и инкрементирует commentsCount', async () => {
			const createdReply = {
				id: 'reply-1',
				text: 'Reply text',
				authorId: 'author-2',
				postId: 'post-1',
				parentId: 'parent-1',
			};

			const mockCommentCreate = vi.fn().mockResolvedValue(createdReply);
			const mockPostUpdate = vi.fn().mockResolvedValue({ id: 'post-1' });

			const mockPrisma = {
				post: {
					findUnique: vi.fn().mockResolvedValue({ id: 'post-1' }),
				},
				comment: {
					findUnique: vi.fn().mockResolvedValue({
						id: 'parent-1',
						postId: 'post-1',
					}),
				},
				$transaction: vi.fn().mockImplementation((callback) => {
					return callback({
						comment: { create: mockCommentCreate },
						post: { update: mockPostUpdate },
					});
				}),
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			const result = await service.create(
				'author-2',
				'post-1',
				'Reply text',
				'parent-1'
			);

			expect(result).toEqual(createdReply);
			expect(mockCommentCreate).toHaveBeenCalledWith({
				data: {
					text: 'Reply text',
					author: { connect: { id: 'author-2' } },
					post: { connect: { id: 'post-1' } },
					parent: { connect: { id: 'parent-1' } },
				},
				include: { author: true },
			});
			expect(mockPostUpdate).toHaveBeenCalledWith({
				where: { id: 'post-1' },
				data: { commentsCount: { increment: 1 } },
			});
		});
	});

	describe('update', () => {
		it('выбрасывает BadRequestException, если обновленный текст пустой', async () => {
			const mockPrisma = {} as unknown as PrismaService;
			const service = new CommentService(mockPrisma);

			await expect(
				service.update('author-1', 'comment-1', '   ')
			).rejects.toThrow(new BadRequestException('Comment text cannot be empty'));
		});

		it('выбрасывает BadRequestException, если длина текста превышает 2000 символов', async () => {
			const mockPrisma = {} as unknown as PrismaService;
			const service = new CommentService(mockPrisma);

			const longText = 'x'.repeat(2001);

			await expect(
				service.update('author-1', 'comment-1', longText)
			).rejects.toThrow(
				new BadRequestException('Comment text cannot exceed 2000 characters')
			);
		});

		it('выбрасывает NotFoundException, если комментарий не найден', async () => {
			const mockPrisma = {
				comment: {
					findUnique: vi.fn().mockResolvedValue(null),
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			await expect(
				service.update('author-1', 'comment-1', 'Updated text')
			).rejects.toThrow(NotFoundException);
		});

		it('выбрасывает ForbiddenException, если пользователь не автор комментария', async () => {
			const mockPrisma = {
				comment: {
					findUnique: vi.fn().mockResolvedValue({
						id: 'comment-1',
						authorId: 'different-author',
					}),
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			await expect(
				service.update('author-1', 'comment-1', 'Updated text')
			).rejects.toThrow(
				new ForbiddenException('You are not the author of this comment')
			);
		});

		it('успешно обновляет комментарий с trimmed текстом, если пользователь автор', async () => {
			const mockUpdate = vi.fn().mockResolvedValue({ id: 'comment-1' });
			const mockPrisma = {
				comment: {
					findUnique: vi.fn().mockResolvedValue({
						id: 'comment-1',
						authorId: 'author-1',
					}),
					update: mockUpdate,
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			const result = await service.update(
				'author-1',
				'comment-1',
				'   Updated text   '
			);

			expect(result).toBe(true);
			expect(mockUpdate).toHaveBeenCalledWith({
				where: { id: 'comment-1' },
				data: { text: 'Updated text' },
			});
		});
	});

	describe('delete', () => {
		it('выбрасывает NotFoundException, если комментарий не найден', async () => {
			const mockPrisma = {
				comment: {
					findUnique: vi.fn().mockResolvedValue(null),
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			await expect(service.delete('author-1', 'comment-1')).rejects.toThrow(
				NotFoundException
			);
		});

		it('выбрасывает ForbiddenException, если пользователь не автор комментария', async () => {
			const mockPrisma = {
				comment: {
					findUnique: vi.fn().mockResolvedValue({
						id: 'comment-1',
						authorId: 'other-author',
					}),
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			await expect(service.delete('author-1', 'comment-1')).rejects.toThrow(
				new ForbiddenException('You are not the author of this comment')
			);
		});

		it('удаляет одиночный комментарий и декрементирует commentsCount на 1', async () => {
			const mockCommentDelete = vi.fn().mockResolvedValue({ id: 'comment-1' });
			const mockPostUpdate = vi.fn().mockResolvedValue({ id: 'post-1' });
			const mockFindMany = vi.fn().mockResolvedValue([]);

			const mockPrisma = {
				comment: {
					findUnique: vi.fn().mockResolvedValue({
						id: 'comment-1',
						authorId: 'author-1',
						postId: 'post-1',
					}),
				},
				$transaction: vi.fn().mockImplementation((callback) => {
					return callback({
						comment: {
							findMany: mockFindMany,
							delete: mockCommentDelete,
						},
						post: {
							update: mockPostUpdate,
						},
					});
				}),
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			const result = await service.delete('author-1', 'comment-1');

			expect(result).toBe(true);
			expect(mockCommentDelete).toHaveBeenCalledWith({
				where: { id: 'comment-1' },
			});
			expect(mockPostUpdate).toHaveBeenCalledWith({
				where: { id: 'post-1' },
				data: { commentsCount: { decrement: 1 } },
			});
		});

		it('удаляет комментарий с каскадными реплаями и декрементирует commentsCount на общее количество удалённых', async () => {
			const mockCommentDelete = vi.fn().mockResolvedValue({ id: 'comment-1' });
			const mockPostUpdate = vi.fn().mockResolvedValue({ id: 'post-1' });

			const mockFindMany = vi
				.fn()
				.mockResolvedValueOnce([{ id: 'reply-1' }, { id: 'reply-2' }])
				.mockResolvedValueOnce([{ id: 'subreply-1' }])
				.mockResolvedValueOnce([]);

			const mockPrisma = {
				comment: {
					findUnique: vi.fn().mockResolvedValue({
						id: 'comment-1',
						authorId: 'author-1',
						postId: 'post-1',
					}),
				},
				$transaction: vi.fn().mockImplementation((callback) => {
					return callback({
						comment: {
							findMany: mockFindMany,
							delete: mockCommentDelete,
						},
						post: {
							update: mockPostUpdate,
						},
					});
				}),
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			const result = await service.delete('author-1', 'comment-1');

			expect(result).toBe(true);
			expect(mockPostUpdate).toHaveBeenCalledWith({
				where: { id: 'post-1' },
				data: { commentsCount: { decrement: 4 } },
			});
		});
	});

	describe('allPostComments', () => {
		it('возвращает только корневые комментарии статьи с parentId: null', async () => {
			const mockFindMany = vi.fn().mockResolvedValue([
				{ id: 'c1', text: 'Root 1', parentId: null },
				{ id: 'c2', text: 'Root 2', parentId: null },
			]);

			const mockPrisma = {
				comment: {
					findMany: mockFindMany,
				},
			} as unknown as PrismaService;

			const service = new CommentService(mockPrisma);

			const result = await service.allPostComments('post-1');

			expect(result).toHaveLength(2);
			expect(mockFindMany).toHaveBeenCalledWith({
				where: {
					postId: 'post-1',
					parentId: null,
				},
				include: {
					author: true,
				},
			});
		});
	});
});
