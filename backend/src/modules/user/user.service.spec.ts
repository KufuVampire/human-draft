import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { UserService } from './user.service';
import { Prisma } from '@/prisma/generated/client';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
	it('findByUsername возвращает профиль с агрегированными счетчиками _count без тяжелых JOIN постов и блогов', async () => {
		const findUnique = vi.fn().mockResolvedValue({
			id: 'user-1',
			username: 'john_doe',
			email: 'john@example.com',
			password: 'hashed-password',
			description: 'Test description',
			avatarUrl: null,
			posterUrl: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			_count: {
				posts: 12,
				blogs: 3,
				subscribers: 45,
				subscriptions: 10,
			},
			subscribers: [{ fromUserId: 'sub-1', id: 's1' }],
			subscriptions: [{ toUserId: 'target-1', id: 's2' }],
		});

		const mockPrisma = {
			user: {
				findUnique,
			},
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);
		const result = await service.findByUsername('john_doe');

		expect(result).toBeDefined();
		expect(result.id).toBe('user-1');
		expect(result.postsCount).toBe(12);
		expect(result.blogsCount).toBe(3);
		expect(result.subscribersCount).toBe(45);
		expect(result.subscriptionsCount).toBe(10);
		expect(result.posts).toEqual([]);
		expect(result.blogs).toEqual([]);
		expect(result.subscribers).toEqual(['sub-1']);
		expect(result.subscriptions).toEqual(['target-1']);

		expect(findUnique).toHaveBeenCalledWith({
			where: { username: 'john_doe' },
			include: expect.objectContaining({
				_count: expect.any(Object),
				subscribers: expect.any(Object),
				subscriptions: expect.any(Object),
			}),
		});

		const callArgs = findUnique.mock.calls[0][0];
		expect(callArgs.include.posts).toBeUndefined();
		expect(callArgs.include.blogs).toBeUndefined();
	});

	it('findByUsername выбрасывает NotFoundException, если пользователь не найден', async () => {
		const findUnique = vi.fn().mockResolvedValue(null);
		const mockPrisma = {
			user: {
				findUnique,
			},
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);

		await expect(service.findByUsername('ghost')).rejects.toThrow(
			NotFoundException
		);
	});

	it('getUserPosts возвращает посты автора, отсортированные по createdAt: desc', async () => {
		const mockPosts = [
			{ id: 'post-1', title: 'First Post', createdAt: new Date() },
		];
		const findMany = vi.fn().mockResolvedValue(mockPosts);
		const mockPrisma = {
			post: { findMany },
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);
		const result = await service.getUserPosts('user-1');

		expect(result).toEqual(mockPosts);
		expect(findMany).toHaveBeenCalledWith({
			where: { authorId: 'user-1' },
			include: { author: true, tags: true },
			orderBy: { createdAt: 'desc' },
		});
	});

	it('getUserBlogs возвращает блоги автора, отсортированные по createdAt: desc', async () => {
		const mockBlogs = [
			{ id: 'blog-1', title: 'Tech Blog', createdAt: new Date() },
		];
		const findMany = vi.fn().mockResolvedValue(mockBlogs);
		const mockPrisma = {
			blog: { findMany },
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);
		const result = await service.getUserBlogs('user-1');

		expect(result).toEqual(mockBlogs);
		expect(findMany).toHaveBeenCalledWith({
			where: { authorId: 'user-1' },
			include: { author: true, tags: true },
			orderBy: { createdAt: 'desc' },
		});
	});

	it('getUserPostsPagination возвращает пагинированный список постов пользователя', async () => {
		const findUnique = vi.fn().mockResolvedValue({ id: 'user-1' });
		const findMany = vi.fn().mockResolvedValue([{ id: 'p1', title: 'P1' }]);
		const count = vi.fn().mockResolvedValue(1);
		const $transaction = vi
			.fn()
			.mockResolvedValue([[{ id: 'p1', title: 'P1' }], 1]);

		const mockPrisma = {
			user: { findUnique },
			post: { findMany, count },
			$transaction,
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);
		const result = await service.getUserPostsPagination('john_doe', {
			page: 1,
			perPage: 10,
		});

		expect(result.data).toHaveLength(1);
		expect(result.totalCount).toBe(1);
		expect(result.totalPages).toBe(1);
	});

	it('getUserBlogsPagination возвращает пагинированный список блогов пользователя', async () => {
		const findUnique = vi.fn().mockResolvedValue({ id: 'user-1' });
		const findMany = vi.fn().mockResolvedValue([{ id: 'b1', title: 'B1' }]);
		const count = vi.fn().mockResolvedValue(1);
		const $transaction = vi
			.fn()
			.mockResolvedValue([[{ id: 'b1', title: 'B1' }], 1]);

		const mockPrisma = {
			user: { findUnique },
			blog: { findMany, count },
			$transaction,
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);
		const result = await service.getUserBlogsPagination('john_doe', {
			page: 1,
			perPage: 10,
		});

		expect(result.data).toHaveLength(1);
		expect(result.totalCount).toBe(1);
		expect(result.totalPages).toBe(1);
	});
	it('findForAuth возвращает легковесную модель пользователя без JOIN блогов и постов', async () => {
		const findUnique = vi.fn().mockResolvedValue({
			id: 'user-1',
			username: 'john_doe',
			email: 'john@example.com',
			password: 'hashed-password',
			description: 'Test description',
			avatarUrl: null,
			posterUrl: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			subscribers: [{ fromUserId: 'sub-1' }],
			subscriptions: [{ toUserId: 'target-1' }],
		});

		const mockPrisma = {
			user: {
				findUnique,
			},
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);
		const result = await service.findForAuth('john_doe');

		expect(result).toBeDefined();
		expect(result?.id).toBe('user-1');
		expect(result?.subscribers).toEqual(['sub-1']);
		expect(result?.subscriptions).toEqual(['target-1']);
		expect(result?.blogs).toEqual([]);
		expect(result?.posts).toEqual([]);
		expect(findUnique).toHaveBeenCalledWith({
			where: { username: 'john_doe' },
			select: expect.objectContaining({
				id: true,
				username: true,
				password: true,
				email: true,
			}),
		});
	});

	it('findForAuth возвращает null, если пользователь не найден', async () => {
		const findUnique = vi.fn().mockResolvedValue(null);
		const mockPrisma = {
			user: {
				findUnique,
			},
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);
		const result = await service.findForAuth('non_existent');

		expect(result).toBeNull();
	});

	it('updateUser перехватывает Prisma P2002 и выбрасывает ConflictException', async () => {
		const p2002Error = new Prisma.PrismaClientKnownRequestError(
			'Unique constraint failed on the fields: (`email`)',
			{
				code: 'P2002',
				clientVersion: '7.x',
			}
		);

		const update = vi.fn().mockRejectedValue(p2002Error);
		const mockPrisma = {
			user: {
				update,
			},
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);

		await expect(
			service.updateUser('user-1', { email: 'taken@example.com' })
		).rejects.toThrow(ConflictException);
	});

	it('getAllUsers передает where в count и корректно рассчитывает totalPages', async () => {
		const mockFindMany = vi.fn();
		const mockCount = vi.fn();
		const mockTransaction = vi.fn().mockImplementation(() => {
			return Promise.resolve([
				[{ id: 'user-2', username: 'alex' }],
				25,
			]);
		});

		const mockPrisma = {
			user: {
				findMany: mockFindMany,
				count: mockCount,
			},
			$transaction: mockTransaction,
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);

		const result = await service.getAllUsers({
			searchParams: { page: 1, perPage: 10 },
			searchStr: 'al',
			userId: 'current-user-id',
		});

		expect(mockTransaction).toHaveBeenCalled();
		expect(mockFindMany).toHaveBeenCalledWith({
			take: 10,
			skip: 0,
			where: {
				id: { not: 'current-user-id' },
				username: { contains: 'al', mode: 'insensitive' },
			},
			orderBy: { username: 'asc' },
		});
		expect(mockCount).toHaveBeenCalledWith({
			where: {
				id: { not: 'current-user-id' },
				username: { contains: 'al', mode: 'insensitive' },
			},
		});
		expect(result.totalCount).toBe(25);
		expect(result.totalPages).toBe(3);
	});

	it('не падает при вызове getAllUsers без аргументов', async () => {
		const mockTransaction = vi.fn().mockImplementation(() => {
			return Promise.resolve([[], 0]);
		});

		const mockPrisma = {
			user: {
				findMany: vi.fn(),
				count: vi.fn(),
			},
			$transaction: mockTransaction,
		} as unknown as PrismaService;

		const service = new UserService(mockPrisma);

		const result = await service.getAllUsers();

		expect(result.page).toBe(1);
		expect(result.perPage).toBe(10);
	});
});
