import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { BlogService } from './blog.service';
import { AwsStorageService } from '../aws-storage/aws-storage.service';
import { PostService } from '../post/post.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BlogService', () => {
	describe('create', () => {
		it('не запрашивает посты, если postIds не передан', async () => {
			const mockFindMany = vi.fn();
			const mockCreate = vi.fn().mockResolvedValue({ id: 'blog-1' });

			const mockPrisma = {
				post: {
					findMany: mockFindMany,
				},
				blog: {
					create: mockCreate,
				},
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			await service.create('author-1', {
				title: 'Blog without posts',
			});

			expect(mockFindMany).not.toHaveBeenCalled();
			expect(mockCreate).toHaveBeenCalledWith({
				data: expect.objectContaining({
					title: 'Blog without posts',
					author: { connect: { id: 'author-1' } },
				}),
			});
		});

		it('запрашивает посты с фильтрацией по authorId, если postIds передан', async () => {
			const mockFindMany = vi
				.fn()
				.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]);
			const mockCreate = vi.fn().mockResolvedValue({ id: 'blog-1' });

			const mockPrisma = {
				post: {
					findMany: mockFindMany,
				},
				blog: {
					create: mockCreate,
				},
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			await service.create('author-1', {
				title: 'Blog with posts',
				postIds: ['p1', 'p2'],
				tags: ['  Tech ', 'tech'],
			});

			expect(mockFindMany).toHaveBeenCalledWith({
				where: {
					id: { in: ['p1', 'p2'] },
					blogId: null,
					authorId: 'author-1',
				},
				select: { id: true },
			});
			expect(mockCreate).toHaveBeenCalledWith({
				data: expect.objectContaining({
					posts: {
						connect: [{ id: 'p1' }, { id: 'p2' }],
					},
					tags: {
						connectOrCreate: [
							{ where: { name: 'tech' }, create: { name: 'tech' } },
						],
					},
				}),
			});
		});
	});

	describe('update', () => {
		it('выбрасывает NotFoundException, если блог не существует', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue(null);
			const mockPrisma = {
				blog: {
					findUnique: mockFindUnique,
				},
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			await expect(
				service.update('author-1', 'blog-1', { title: 'New Blog' })
			).rejects.toThrow(NotFoundException);
			expect(mockFindUnique).toHaveBeenCalledWith({
				where: { id: 'blog-1' },
			});
		});

		it('выбрасывает ForbiddenException, если пользователь не является автором блога', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'other-author',
			});
			const mockPrisma = {
				blog: {
					findUnique: mockFindUnique,
				},
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			await expect(
				service.update('author-1', 'blog-1', { title: 'New Blog' })
			).rejects.toThrow(ForbiddenException);
		});

		it('привязывает только посты автора и нормализует теги при успешном обновлении', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'author-1',
			});
			const mockFindManyPosts = vi
				.fn()
				.mockResolvedValue([{ id: 'post-1' }, { id: 'post-2' }]);
			const mockUpdateBlog = vi.fn().mockResolvedValue({ id: 'blog-1' });

			const mockPrisma = {
				blog: {
					findUnique: mockFindUnique,
					update: mockUpdateBlog,
				},
				post: {
					findMany: mockFindManyPosts,
				},
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			const result = await service.update('author-1', 'blog-1', {
				title: 'Updated Blog',
				description: 'Updated Description',
				postIds: ['post-1', 'post-2', 'foreign-post'],
				tags: ['  NestJS  ', 'nestjs', ''],
			});

			expect(result).toBe(true);
			expect(mockFindManyPosts).toHaveBeenCalledWith({
				where: {
					id: { in: ['post-1', 'post-2', 'foreign-post'] },
					authorId: 'author-1',
					OR: [{ blogId: null }, { blogId: 'blog-1' }],
				},
				select: { id: true },
			});
			expect(mockUpdateBlog).toHaveBeenCalledWith({
				where: { id: 'blog-1' },
				data: {
					title: 'Updated Blog',
					description: 'Updated Description',
					posts: {
						connect: [{ id: 'post-1' }, { id: 'post-2' }],
					},
					tags: {
						set: [],
						connectOrCreate: [
							{ where: { name: 'nestjs' }, create: { name: 'nestjs' } },
						],
					},
				},
			});
		});
	});

	describe('delete', () => {
		it('выбрасывает NotFoundException, если блог не найден', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue(null);
			const mockPrisma = {
				blog: {
					findUnique: mockFindUnique,
				},
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			await expect(
				service.delete('author-1', 'blog-1')
			).rejects.toThrow(NotFoundException);
		});

		it('выбрасывает ForbiddenException, если пользователь не является автором блога', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'other-author',
			});
			const mockPrisma = {
				blog: {
					findUnique: mockFindUnique,
				},
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			await expect(
				service.delete('author-1', 'blog-1')
			).rejects.toThrow(ForbiddenException);
		});

		it('успешно удаляет блог, если пользователь является автором', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'author-1',
			});
			const mockDelete = vi.fn().mockResolvedValue({ id: 'blog-1' });

			const mockPrisma = {
				blog: {
					findUnique: mockFindUnique,
					delete: mockDelete,
				},
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			const result = await service.delete('author-1', 'blog-1');

			expect(result).toBe(true);
			expect(mockDelete).toHaveBeenCalledWith({
				where: {
					id: 'blog-1',
					author: { id: 'author-1' },
				},
			});
		});
	});

	describe('getAllBlogs', () => {
		it('передает where в count и сортирует по createdAt desc', async () => {
			const mockFindMany = vi.fn();
			const mockCount = vi.fn();
			const mockTransaction = vi.fn().mockImplementation(() => {
				return Promise.resolve([
					[{ id: 'blog-1', title: 'Tech Blog' }],
					1,
				]);
			});

			const mockPrisma = {
				blog: {
					findMany: mockFindMany,
					count: mockCount,
				},
				$transaction: mockTransaction,
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			const result = await service.getAllBlogs(
				{ page: 1, perPage: 10 },
				{ search: 'tech' }
			);

			expect(mockTransaction).toHaveBeenCalled();
			expect(mockFindMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						title: {
							contains: 'tech',
							mode: 'insensitive',
						},
					},
					orderBy: { createdAt: 'desc' },
					skip: 0,
					take: 10,
				})
			);
			expect(mockCount).toHaveBeenCalledWith({
				where: {
					title: {
						contains: 'tech',
						mode: 'insensitive',
					},
				},
			});
			expect(result.totalCount).toBe(1);
			expect(result.totalPages).toBe(1);
		});

		it('не падает при вызове без searchParams', async () => {
			const mockTransaction = vi.fn().mockImplementation(() => {
				return Promise.resolve([[], 0]);
			});

			const mockPrisma = {
				blog: {
					findMany: vi.fn(),
					count: vi.fn(),
				},
				$transaction: mockTransaction,
			} as unknown as PrismaService;
			const mockPostService = {} as unknown as PostService;
			const mockStorageService = {} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				mockPostService,
				mockStorageService
			);

			const result = await service.getAllBlogs(undefined);

			expect(result.page).toBe(1);
			expect(result.perPage).toBe(10);
		});
	});

	describe('changePoster', () => {
		it('выбрасывает NotFoundException, если блог не существует', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue(null);
			const mockPrisma = {
				blog: { findUnique: mockFindUnique },
			} as unknown as PrismaService;
			const service = new BlogService(
				mockPrisma,
				{} as unknown as PostService,
				{} as unknown as AwsStorageService
			);

			await expect(
				service.changePoster('author-1', 'blog-1', {
					filename: 'test.jpg',
					mimetype: 'image/jpeg',
					createReadStream: vi.fn(),
				} as any)
			).rejects.toThrow(NotFoundException);
			expect(mockFindUnique).toHaveBeenCalledWith({
				where: { id: 'blog-1' },
			});
		});

		it('выбрасывает ForbiddenException, если пользователь не автор блога', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'other-author',
			});
			const mockPrisma = {
				blog: { findUnique: mockFindUnique },
			} as unknown as PrismaService;
			const service = new BlogService(
				mockPrisma,
				{} as unknown as PostService,
				{} as unknown as AwsStorageService
			);

			await expect(
				service.changePoster('author-1', 'blog-1', {
					filename: 'test.jpg',
					mimetype: 'image/jpeg',
					createReadStream: vi.fn(),
				} as any)
			).rejects.toThrow(ForbiddenException);
		});

		it('выбрасывает BadRequestException, если файл постера не передан', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'author-1',
			});
			const mockPrisma = {
				blog: { findUnique: mockFindUnique },
			} as unknown as PrismaService;
			const service = new BlogService(
				mockPrisma,
				{} as unknown as PostService,
				{} as unknown as AwsStorageService
			);

			await expect(
				service.changePoster('author-1', 'blog-1', undefined as any)
			).rejects.toThrow(BadRequestException);
		});
	});

	describe('deletePoster', () => {
		it('выбрасывает NotFoundException, если блог не существует', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue(null);
			const mockPrisma = {
				blog: { findUnique: mockFindUnique },
			} as unknown as PrismaService;
			const service = new BlogService(
				mockPrisma,
				{} as unknown as PostService,
				{} as unknown as AwsStorageService
			);

			await expect(
				service.deletePoster('author-1', 'blog-1')
			).rejects.toThrow(NotFoundException);
			expect(mockFindUnique).toHaveBeenCalledWith({
				where: { id: 'blog-1' },
			});
		});

		it('выбрасывает ForbiddenException, если пользователь не автор блога', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'other-author',
			});
			const mockPrisma = {
				blog: { findUnique: mockFindUnique },
			} as unknown as PrismaService;
			const service = new BlogService(
				mockPrisma,
				{} as unknown as PostService,
				{} as unknown as AwsStorageService
			);

			await expect(
				service.deletePoster('author-1', 'blog-1')
			).rejects.toThrow(ForbiddenException);
		});

		it('удаляет старый постер из хранилища и обновляет blog, если пользователь автор', async () => {
			const mockFindUnique = vi.fn().mockResolvedValue({
				id: 'blog-1',
				authorId: 'author-1',
				posterUrl: 'https://storage/blogs/blog-1-poster.webp',
			});
			const mockUpdate = vi.fn().mockResolvedValue({ id: 'blog-1' });
			const mockRemove = vi.fn().mockResolvedValue(true);

			const mockPrisma = {
				blog: {
					findUnique: mockFindUnique,
					update: mockUpdate,
				},
			} as unknown as PrismaService;
			const mockStorageService = {
				remove: mockRemove,
			} as unknown as AwsStorageService;

			const service = new BlogService(
				mockPrisma,
				{} as unknown as PostService,
				mockStorageService
			);

			const result = await service.deletePoster('author-1', 'blog-1');

			expect(result).toBe(true);
			expect(mockRemove).toHaveBeenCalledWith(
				'https://storage/blogs/blog-1-poster.webp'
			);
			expect(mockUpdate).toHaveBeenCalledWith({
				where: { id: 'blog-1' },
				data: { posterUrl: null },
			});
		});
	});
});
