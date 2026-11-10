import { describe, expect, it } from 'vitest';

import { extractMediaKeysFromContent, KeyExtractor } from './extractMediaKeys';

describe('extractMediaKeysFromContent', () => {
	const mockStorage: KeyExtractor = {
		extractKey: (url: string) => {
			if (!url) return '';
			if (url.includes('posts/')) {
				const match = url.match(/posts\/[\w.-]+/);
				return match ? match[0] : '';
			}
			return '';
		},
	};

	it('возвращает пустой массив при пустом, null или невалидном контенте', () => {
		expect(extractMediaKeysFromContent(null, mockStorage)).toEqual([]);
		expect(extractMediaKeysFromContent(undefined, mockStorage)).toEqual([]);
		expect(extractMediaKeysFromContent(123, mockStorage)).toEqual([]);
		expect(extractMediaKeysFromContent('invalid json string', mockStorage)).toEqual(
			[]
		);
	});

	it('возвращает пустой массив, если в документе нет изображений', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'Hello world' }],
				},
			],
		};

		expect(extractMediaKeysFromContent(content, mockStorage)).toEqual([]);
	});

	it('извлекает ключ одиночного изображения', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'image',
					attrs: {
						src: 'https://bucket.s3.amazonaws.com/posts/img-1-12345.webp',
					},
				},
			],
		};

		expect(extractMediaKeysFromContent(content, mockStorage)).toEqual([
			'posts/img-1-12345.webp',
		]);
	});

	it('извлекает вложенные изображения из различных уровней дерева AST', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'image',
							attrs: {
								src: 'https://bucket.s3.amazonaws.com/posts/nested-img-1.webp',
							},
						},
					],
				},
				{
					type: 'bulletList',
					content: [
						{
							type: 'listItem',
							content: [
								{
									type: 'image',
									attrs: {
										src: 'https://bucket.s3.amazonaws.com/posts/nested-img-2.webp',
									},
								},
							],
						},
					],
				},
			],
		};

		expect(extractMediaKeysFromContent(content, mockStorage)).toEqual([
			'posts/nested-img-1.webp',
			'posts/nested-img-2.webp',
		]);
	});

	it('дедуплицирует ключи при повторном вхождении одного и того же изображения', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'image',
					attrs: {
						src: 'https://bucket.s3.amazonaws.com/posts/duplicate.webp',
					},
				},
				{
					type: 'image',
					attrs: {
						src: 'https://bucket.s3.amazonaws.com/posts/duplicate.webp',
					},
				},
			],
		};

		expect(extractMediaKeysFromContent(content, mockStorage)).toEqual([
			'posts/duplicate.webp',
		]);
	});

	it('поддерживает строковый JSON контент', () => {
		const content = JSON.stringify({
			type: 'doc',
			content: [
				{
					type: 'image',
					attrs: {
						src: 'https://bucket.s3.amazonaws.com/posts/stringified.webp',
					},
				},
			],
		});

		expect(extractMediaKeysFromContent(content, mockStorage)).toEqual([
			'posts/stringified.webp',
		]);
	});

	it('игнорирует внешние URL, которые не принадлежат хранилищу', () => {
		const content = {
			type: 'doc',
			content: [
				{
					type: 'image',
					attrs: {
						src: 'https://external-website.com/photo.jpg',
					},
				},
				{
					type: 'image',
					attrs: {
						src: 'https://bucket.s3.amazonaws.com/posts/valid.webp',
					},
				},
			],
		};

		expect(extractMediaKeysFromContent(content, mockStorage)).toEqual([
			'posts/valid.webp',
		]);
	});
});
