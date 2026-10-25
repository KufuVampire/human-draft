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
				}),
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
});
