import {
	ConflictException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { PostService } from './post.service';
import { AwsStorageService } from '../aws-storage/aws-storage.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostService', () => {
	describe('create', () => {
		it('нормализует и дедуплицирует теги при создании поста', async () => {
			const mockCreate = vi.fn().mockResolvedValue({ id: 'post-1' });
			const mockPrisma = {
				post: {
					create: mockCreate,
				},
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await service.create('author-1', {
				title: 'Post Title',
				content: { type: 'doc' },
				tags: ['  React  ', 'react', '  '],
			});

			expect(mockCreate).toHaveBeenCalledWith({
				data: expect.objectContaining({
					title: 'Post Title',
					content: { type: 'doc' },
					author: { connect: { id: 'author-1' } },
					tags: {
						connectOrCreate: [
							{ where: { name: 'react' }, create: { name: 'react' } },
						],
					},
				}),
			});
		});
	});

	describe('update', () => {
		it('выбрасывает NotFoundException, если пост не найден', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue(null);
			const mockPrisma = {
				post: {
					findUnique: mockFindUnique,
				},
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(
				service.update('author-1', 'post-1', { title: 'New title' })
			).rejects.toThrow(NotFoundException);
			expect(mockFindUnique).toHaveBeenCalledWith({
				where: { id: 'post-1' },
			});
		});

		it('выбрасывает ForbiddenException, если автор не совпадает', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'post-1',
				authorId: 'other-author',
			});
			const mockPrisma = {
				post: {
					findUnique: mockFindUnique,
				},
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(
				service.update('author-1', 'post-1', { title: 'New title' })
			).rejects.toThrow(ForbiddenException);
		});

		it('успешно обновляет пост и нормализует теги, если автор совпадает', async () => {
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
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			const result = await service.update('author-1', 'post-1', {
				title: 'Updated title',
				tags: ['  Tech ', 'TECH', 'news'],
			});

			expect(result).toBe(true);
			expect(mockUpdate).toHaveBeenCalledWith({
				where: { id: 'post-1' },
				data: {
					title: 'Updated title',
					content: undefined,
					tags: {
						set: [],
						connectOrCreate: [
							{ where: { name: 'tech' }, create: { name: 'tech' } },
							{ where: { name: 'news' }, create: { name: 'news' } },
						],
					},
				},
			});
		});
	});

	describe('delete', () => {
		it('выбрасывает NotFoundException, если пост не существует', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue(null);
			const mockPrisma = {
				post: {
					findUnique: mockFindUnique,
				},
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(
				service.delete('author-1', 'non-existent')
			).rejects.toThrow(NotFoundException);
		});

		it('выбрасывает ForbiddenException, если автор не совпадает', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'post-1',
				authorId: 'another-user',
			});
			const mockPrisma = {
				post: {
					findUnique: mockFindUnique,
				},
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(service.delete('author-1', 'post-1')).rejects.toThrow(
				ForbiddenException
			);
		});

		it('удаляет связанные изображения и пост при совпадении автора', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'post-1',
				authorId: 'author-1',
				content: {
					content: [
						{
							type: 'image',
							attrs: { src: 'https://s3.amazonaws.com/bucket/posts/img1.webp' },
						},
						{
							type: 'paragraph',
							content: [
								{
									type: 'image',
									attrs: { src: 'https://s3.amazonaws.com/bucket/posts/img2.webp' },
								},
							],
						},
					],
				},
			});
			const mockDelete = vi.fn().mockResolvedValue({ id: 'post-1' });
			const mockStorageRemove = vi.fn().mockResolvedValue(undefined);

			const mockPrisma = {
				post: {
					findUnique: mockFindUnique,
					delete: mockDelete,
				},
			} as unknown as PrismaService;
			const mockStorage = {
				remove: mockStorageRemove,
			} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await service.delete('author-1', 'post-1');

			expect(mockStorageRemove).toHaveBeenCalledWith(
				'https://s3.amazonaws.com/bucket/posts/img1.webp'
			);
			expect(mockStorageRemove).toHaveBeenCalledWith(
				'https://s3.amazonaws.com/bucket/posts/img2.webp'
			);
			expect(mockDelete).toHaveBeenCalledWith({
				where: { id: 'post-1' },
			});
		});
	});

	describe('unPinPostFromBlog', () => {
		it('выбрасывает NotFoundException, если пост не найден', async () => {
			const mockFindUniquePost = vi.fn().mockResolvedValue(null);
			const mockPrisma = {
				post: { findUnique: mockFindUniquePost },
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(
				service.unPinPostFromBlog('author-1', 'post-1', 'blog-1')
			).rejects.toThrow(NotFoundException);
		});

		it('выбрасывает ForbiddenException, если автор поста не совпадает', async () => {
			const mockFindUniquePost = vi.fn().mockResolvedValue({
				id: 'post-1',
				authorId: 'other-author',
			});
			const mockPrisma = {
				post: { findUnique: mockFindUniquePost },
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(
				service.unPinPostFromBlog('author-1', 'post-1', 'blog-1')
			).rejects.toThrow(ForbiddenException);
		});

		it('выбрасывает NotFoundException, если блог не найден', async () => {
			const mockFindUniquePost = vi.fn().mockResolvedValue({
				id: 'post-1',
				authorId: 'author-1',
			});
			const mockFindUniqueBlog = vi.fn().mockResolvedValue(null);
			const mockPrisma = {
				post: { findUnique: mockFindUniquePost },
				blog: { findUnique: mockFindUniqueBlog },
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(
				service.unPinPostFromBlog('author-1', 'post-1', 'blog-1')
			).rejects.toThrow(NotFoundException);
		});

		it('выбрасывает ForbiddenException, если автор блога не совпадает', async () => {
			const mockFindUniquePost = vi.fn().mockResolvedValue({
				id: 'post-1',
				authorId: 'author-1',
			});
			const mockFindUniqueBlog = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'other-author',
			});
			const mockPrisma = {
				post: { findUnique: mockFindUniquePost },
				blog: { findUnique: mockFindUniqueBlog },
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(
				service.unPinPostFromBlog('author-1', 'post-1', 'blog-1')
			).rejects.toThrow(ForbiddenException);
		});

		it('выбрасывает ConflictException, если пост не привязан к данному блогу', async () => {
			const mockFindUniquePost = vi.fn().mockResolvedValue({
				id: 'post-1',
				authorId: 'author-1',
				blogId: 'other-blog',
			});
			const mockFindUniqueBlog = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'author-1',
			});
			const mockPrisma = {
				post: { findUnique: mockFindUniquePost },
				blog: { findUnique: mockFindUniqueBlog },
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await expect(
				service.unPinPostFromBlog('author-1', 'post-1', 'blog-1')
			).rejects.toThrow(ConflictException);
		});

		it('успешно открепляет пост от блога при совпадении автора', async () => {
			const mockFindUniquePost = vi.fn().mockResolvedValue({
				id: 'post-1',
				authorId: 'author-1',
				blogId: 'blog-1',
			});
			const mockFindUniqueBlog = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'author-1',
			});
			const mockUpdatePost = vi.fn().mockResolvedValue({ id: 'post-1' });

			const mockPrisma = {
				post: {
					findUnique: mockFindUniquePost,
					update: mockUpdatePost,
				},
				blog: { findUnique: mockFindUniqueBlog },
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			await service.unPinPostFromBlog('author-1', 'post-1', 'blog-1');

			expect(mockUpdatePost).toHaveBeenCalledWith({
				where: { id: 'post-1' },
				data: {
					blog: { disconnect: true },
				},
			});
		});
	});

	describe('getAllPosts', () => {
		it('передает where в count и сортирует по createdAt desc', async () => {
			const mockFindMany = vi.fn();
			const mockCount = vi.fn();
			const mockTransaction = vi.fn().mockImplementation(() => {
				return Promise.resolve([
					[
						{ id: 'post-2', createdAt: new Date('2026-01-02') },
						{ id: 'post-1', createdAt: new Date('2026-01-01') },
					],
					2,
				]);
			});

			const mockPrisma = {
				post: {
					findMany: mockFindMany,
					count: mockCount,
				},
				$transaction: mockTransaction,
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			const result = await service.getAllPosts(
				{ page: 1, perPage: 10 },
				{ search: 'test-query' }
			);

			expect(mockTransaction).toHaveBeenCalled();
			expect(mockFindMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						title: { contains: 'test-query', mode: 'insensitive' },
					},
					orderBy: { createdAt: 'desc' },
					skip: 0,
					take: 10,
				})
			);
			expect(mockCount).toHaveBeenCalledWith({
				where: {
					title: { contains: 'test-query', mode: 'insensitive' },
				},
			});
			expect(result.totalPages).toBe(1);
			expect(result.totalCount).toBe(2);
		});

		it('не падает при вызове без searchParams', async () => {
			const mockTransaction = vi.fn().mockImplementation(() => {
				return Promise.resolve([[], 0]);
			});

			const mockPrisma = {
				post: {
					findMany: vi.fn(),
					count: vi.fn(),
				},
				$transaction: mockTransaction,
			} as unknown as PrismaService;
			const mockStorage = {} as unknown as AwsStorageService;

			const service = new PostService(mockPrisma, mockStorage);

			const result = await service.getAllPosts(undefined);

			expect(result.page).toBe(1);
			expect(result.perPage).toBe(10);
		});
	});
});
