import { describe, expect, it, vi } from 'vitest';

import { BlogService } from './blog.service';
import { AwsStorageService } from '../aws-storage/aws-storage.service';
import { PostService } from '../post/post.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BlogService', () => {
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
	});
});
