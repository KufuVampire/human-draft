import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { TagService } from './tag.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TagService', () => {
	describe('updateTags', () => {
		describe('for post', () => {
			it('выбрасывает NotFoundException, если пост не существует', async () => {
				const mockFindUnique = vi.fn().mockResolvedValue(null);
				const mockPrisma = {
					post: {
						findUnique: mockFindUnique,
					},
				} as unknown as PrismaService;

				const service = new TagService(mockPrisma);

				await expect(
					service.updateTags('author-1', ['tag1'], { postId: 'post-1' })
				).rejects.toThrow(NotFoundException);
			});

			it('выбрасывает ForbiddenException, если автор поста не совпадает', async () => {
				const mockFindUnique = vi.fn().mockResolvedValue({
					id: 'post-1',
					authorId: 'other-author',
				});
				const mockPrisma = {
					post: {
						findUnique: mockFindUnique,
					},
				} as unknown as PrismaService;

				const service = new TagService(mockPrisma);

				await expect(
					service.updateTags('author-1', ['tag1'], { postId: 'post-1' })
				).rejects.toThrow(ForbiddenException);
			});

			it('успешно обновляет теги поста, если автор совпадает', async () => {
				const mockFindUnique = vi.fn().mockResolvedValue({
					id: 'post-1',
					authorId: 'author-1',
				});
				const mockUpdate = vi.fn().mockResolvedValue({ id: 'post-1' });
				const mockPrisma = {
					post: {
						findUnique: mockFindUnique,
						update: mockUpdate,
					},
				} as unknown as PrismaService;

				const service = new TagService(mockPrisma);

				const result = await service.updateTags('author-1', ['tag1', 'tag2'], {
					postId: 'post-1',
				});

				expect(result).toBe(true);
				expect(mockUpdate).toHaveBeenCalledWith({
					where: { id: 'post-1' },
					data: {
						tags: {
							set: [],
							connectOrCreate: [
								{ where: { name: 'tag1' }, create: { name: 'tag1' } },
								{ where: { name: 'tag2' }, create: { name: 'tag2' } },
							],
						},
					},
				});
			});
		});

		describe('for blog', () => {
			it('выбрасывает NotFoundException, если блог не существует', async () => {
				const mockFindUnique = vi.fn().mockResolvedValue(null);
				const mockPrisma = {
					blog: {
						findUnique: mockFindUnique,
					},
				} as unknown as PrismaService;

				const service = new TagService(mockPrisma);

				await expect(
					service.updateTags('author-1', ['tag1'], { blogId: 'blog-1' })
				).rejects.toThrow(NotFoundException);
			});

			it('выбрасывает ForbiddenException, если автор блога не совпадает', async () => {
				const mockFindUnique = vi.fn().mockResolvedValue({
					id: 'blog-1',
					authorId: 'other-author',
				});
				const mockPrisma = {
					blog: {
						findUnique: mockFindUnique,
					},
				} as unknown as PrismaService;

				const service = new TagService(mockPrisma);

				await expect(
					service.updateTags('author-1', ['tag1'], { blogId: 'blog-1' })
				).rejects.toThrow(ForbiddenException);
			});

			it('успешно обновляет теги блога, если автор совпадает', async () => {
				const mockFindUnique = vi.fn().mockResolvedValue({
					id: 'blog-1',
					authorId: 'author-1',
				});
				const mockUpdate = vi.fn().mockResolvedValue({ id: 'blog-1' });
				const mockPrisma = {
					blog: {
						findUnique: mockFindUnique,
						update: mockUpdate,
					},
				} as unknown as PrismaService;

				const service = new TagService(mockPrisma);

				const result = await service.updateTags('author-1', ['tag1'], {
					blogId: 'blog-1',
				});

				expect(result).toBe(true);
				expect(mockUpdate).toHaveBeenCalledWith({
					where: { id: 'blog-1' },
					data: {
						tags: {
							set: [],
							connectOrCreate: [
								{ where: { name: 'tag1' }, create: { name: 'tag1' } },
							],
						},
					},
				});
			});
		});
	});
});
