import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from 'graphql-upload-ts';
import { describe, expect, it, vi } from 'vitest';

import { AwsStorageService } from './aws-storage.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AwsStorageService', () => {
	const mockConfigService = {
		getOrThrow: vi.fn((key: string) => {
			if (key === 'S3_REGION') return 'us-east-1';
			if (key === 'S3_ACCESS_KEY_ID') return 'mock-key-id';
			if (key === 'S3_SECRET_ACCESS_KEY') return 'mock-secret-key';
			if (key === 'S3_BUCKET_NAME') return 'test-bucket';
			return '';
		}),
	} as unknown as ConfigService;

	const mockPrismaService = {} as unknown as PrismaService;

	const service = new AwsStorageService(mockConfigService, mockPrismaService);

	describe('extractKey', () => {
		it('Извлекает ключ из абсолютного URL S3', () => {
			const url = 'https://test-bucket.s3.amazonaws.com/posts/image-123.webp';
			expect(service.extractKey(url)).toBe('posts/image-123.webp');
		});

		it('Извлекает ключ из URL с кастомным регионом или доменом', () => {
			const url = 'https://s3.eu-central-1.amazonaws.com/users/456-avatar.webp';
			expect(service.extractKey(url)).toBe('users/456-avatar.webp');
		});

		it('Удаляет ведущие слэши из относительного пути', () => {
			expect(service.extractKey('/blogs/blog-1-poster.webp')).toBe(
				'blogs/blog-1-poster.webp'
			);
			expect(service.extractKey('blogs/blog-1-poster.webp')).toBe(
				'blogs/blog-1-poster.webp'
			);
		});

		it('Возвращает пустую строку для пустых входных данных', () => {
			expect(service.extractKey('')).toBe('');
		});
	});

	describe('getFileUrl', () => {
		it('Формирует канонический URL файла в S3', () => {
			expect(service.getFileUrl('posts/image-123.webp')).toBe(
				'https://test-bucket.s3.amazonaws.com/posts/image-123.webp'
			);
			expect(service.getFileUrl('/posts/image-123.webp')).toBe(
				'https://test-bucket.s3.amazonaws.com/posts/image-123.webp'
			);
		});
	});

	describe('uploadForPost', () => {
		it('Отправляет в S3 ContentType: image/webp и ACL: public-read по умолчанию', async () => {
			const sendMock = vi.fn().mockResolvedValue({});
			vi.spyOn(service['client'], 'send').mockImplementation(sendMock);

			const mockFile = {
				filename: 'test-image.png',
				mimetype: 'image/png',
				encoding: '7bit',
				createReadStream: () =>
					Readable.from([
						Buffer.from(
							'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
							'base64'
						),
					]),
			} as unknown as FileUpload;

			const result = await service.uploadForPost(mockFile);

			expect(result.url).toContain(
				'https://test-bucket.s3.amazonaws.com/posts/'
			);
			expect(sendMock).toHaveBeenCalledWith(
				expect.objectContaining({
					input: expect.objectContaining({
						Bucket: 'test-bucket',
						ContentType: 'image/webp',
						ACL: 'public-read',
					}),
				})
			);
		});
	});
});
