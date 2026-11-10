import { describe, expect, it, vi } from 'vitest';

import { AwsStorageService } from './aws-storage.service';
import { MediaCleanupService } from './media-cleanup.service';
import { PrismaService } from '../prisma/prisma.service';

import { MediaStatus } from '@/prisma/generated/enums';

describe('MediaCleanupService', () => {
	it('возвращает 0 и не вызывает удаление, если нет устаревших черновиков', async () => {
		const mockFindMany = vi.fn().mockResolvedValue([]);
		const mockDeleteMany = vi.fn();
		const mockRemoveMany = vi.fn();
		const mockPrisma = {
			mediaAttachment: {
				findMany: mockFindMany,
				deleteMany: mockDeleteMany,
			},
		} as unknown as PrismaService;

		const mockStorage = {
			removeMany: mockRemoveMany,
		} as unknown as AwsStorageService;

		const service = new MediaCleanupService(mockPrisma, mockStorage);

		const result = await service.cleanupStalePendingMedia();

		expect(result).toEqual({ deletedCount: 0 });
		expect(mockFindMany).toHaveBeenCalledWith({
			where: {
				status: MediaStatus.PENDING,
				createdAt: {
					lt: expect.any(Date),
				},
			},
			select: {
				id: true,
				key: true,
			},
		});
		expect(mockRemoveMany).not.toHaveBeenCalled();
		expect(mockDeleteMany).not.toHaveBeenCalled();
	});

	it('удаляет файлы из S3 и записи из БД для устаревших PENDING вложений', async () => {
		const mockStaleAttachments = [
			{ id: 'att-1', key: 'posts/file1.webp' },
			{ id: 'att-2', key: 'posts/file2.webp' },
		];

		const mockFindMany = vi.fn().mockResolvedValue(mockStaleAttachments);
		const mockDeleteMany = vi.fn().mockResolvedValue({ count: 2 });
		const mockRemoveMany = vi.fn().mockResolvedValue(undefined);

		const mockPrisma = {
			mediaAttachment: {
				findMany: mockFindMany,
				deleteMany: mockDeleteMany,
			},
		} as unknown as PrismaService;

		const mockStorage = {
			removeMany: mockRemoveMany,
		} as unknown as AwsStorageService;

		const service = new MediaCleanupService(mockPrisma, mockStorage);

		const result = await service.cleanupStalePendingMedia();

		expect(result).toEqual({ deletedCount: 2 });
		expect(mockRemoveMany).toHaveBeenCalledWith([
			'posts/file1.webp',
			'posts/file2.webp',
		]);
		expect(mockDeleteMany).toHaveBeenCalledWith({
			where: {
				id: {
					in: ['att-1', 'att-2'],
				},
			},
		});
	});

	it('использует кастомный maxAgeMs порог времени, если он передан', async () => {
		const mockFindMany = vi.fn().mockResolvedValue([]);
		const mockPrisma = {
			mediaAttachment: {
				findMany: mockFindMany,
				deleteMany: vi.fn(),
			},
		} as unknown as PrismaService;
		const mockStorage = {
			removeMany: vi.fn(),
		} as unknown as AwsStorageService;

		const service = new MediaCleanupService(mockPrisma, mockStorage);
		const oneHourMs = 60 * 60 * 1000;
		const beforeTime = Date.now() - oneHourMs;

		await service.cleanupStalePendingMedia(oneHourMs);

		const calledThreshold = mockFindMany.mock.calls[0][0].where.createdAt.lt;
		expect(calledThreshold.getTime()).toBeGreaterThanOrEqual(beforeTime - 100);
		expect(calledThreshold.getTime()).toBeLessThanOrEqual(Date.now());
	});

	it('батчит удаление записей из базы данных по 1000 штук при большом количестве устаревших вложений', async () => {
		const totalItems = 1500;
		const mockStaleAttachments = Array.from({ length: totalItems }, (_, i) => ({
			id: `att-${i}`,
			key: `posts/file-${i}.webp`,
		}));

		const mockFindMany = vi.fn().mockResolvedValue(mockStaleAttachments);
		const mockDeleteMany = vi
			.fn()
			.mockResolvedValueOnce({ count: 1000 })
			.mockResolvedValueOnce({ count: 500 });
		const mockRemoveMany = vi.fn().mockResolvedValue(undefined);

		const mockPrisma = {
			mediaAttachment: {
				findMany: mockFindMany,
				deleteMany: mockDeleteMany,
			},
		} as unknown as PrismaService;

		const mockStorage = {
			removeMany: mockRemoveMany,
		} as unknown as AwsStorageService;

		const service = new MediaCleanupService(mockPrisma, mockStorage);

		const result = await service.cleanupStalePendingMedia();

		expect(result).toEqual({ deletedCount: 1500 });
		expect(mockDeleteMany).toHaveBeenCalledTimes(2);
		expect(mockDeleteMany).toHaveBeenNthCalledWith(1, {
			where: {
				id: {
					in: mockStaleAttachments.slice(0, 1000).map((a) => a.id),
				},
			},
		});
		expect(mockDeleteMany).toHaveBeenNthCalledWith(2, {
			where: {
				id: {
					in: mockStaleAttachments.slice(1000).map((a) => a.id),
				},
			},
		});
	});
});
