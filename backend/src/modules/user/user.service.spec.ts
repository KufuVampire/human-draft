import { ConflictException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { UserService } from './user.service';
import { Prisma } from '@/prisma/generated/client';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
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
});
