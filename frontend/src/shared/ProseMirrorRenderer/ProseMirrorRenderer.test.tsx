import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
	ProseMirrorNodeJSON,
	ProseMirrorRenderer,
	sanitizeImageUrl,
	sanitizeLinkUrl,
} from './ProseMirrorRenderer';

describe('ProseMirrorRenderer (colocated unit tests)', () => {
	it('Рендерит базовые текстовые блоки и заголовки без двойной обёртки doc', () => {
		const doc: ProseMirrorNodeJSON = {
			type: 'doc',
			content: [
				{
					type: 'heading',
					attrs: { level: 1 },
					content: [{ type: 'text', text: 'Заголовок статьи' }],
				},
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'Обычный текст и ' },
						{
							type: 'text',
							text: 'жирный текст',
							marks: [{ type: 'strong' }],
						},
					],
				},
			],
		};

		const { container } = render(<ProseMirrorRenderer doc={doc} />);

		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
			'Заголовок статьи'
		);
		expect(screen.getByText('жирный текст').tagName).toBe('STRONG');

		// Проверка: нет дублирующихся вложенных .prose-mirror-doc
		expect(container.querySelectorAll('.prose-mirror-doc').length).toBe(1);
	});

	it('Безопасно экранирует Stored XSS в тексте (скрипт не исполняется)', () => {
		const maliciousDoc: ProseMirrorNodeJSON = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: '<script>alert("xss")</script><img src=x onerror=alert(1)>',
						},
					],
				},
			],
		};

		const { container } = render(<ProseMirrorRenderer doc={maliciousDoc} />);

		// Никаких тегов script в DOM не появилось
		expect(container.querySelector('script')).toBeNull();
		// Текст экранирован и выведен как обычная строка
		expect(container.textContent).toContain(
			'<script>alert("xss")</script><img src=x onerror=alert(1)>'
		);
	});

	it('Нейтрализует вредоносные ссылки javascript: и data: в ссылках', () => {
		const maliciousLinkDoc: ProseMirrorNodeJSON = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Опасная ссылка',
							marks: [
								{
									type: 'link',
									attrs: { href: 'javascript:alert("hacked")' },
								},
							],
						},
						{
							type: 'text',
							text: 'SVG ссылка',
							marks: [
								{
									type: 'link',
									attrs: { href: 'data:image/svg+xml,<svg onload=alert(1)>' },
								},
							],
						},
					],
				},
			],
		};

		render(<ProseMirrorRenderer doc={maliciousLinkDoc} />);

		const link1 = screen.getByRole('link', { name: 'Опасная ссылка' });
		expect(link1).toHaveAttribute('href', '#');
		expect(link1).toHaveAttribute('target', '_blank');
		expect(link1).toHaveAttribute('rel', 'noopener noreferrer');

		const link2 = screen.getByRole('link', { name: 'SVG ссылка' });
		expect(link2).toHaveAttribute('href', '#');
	});

	it('Корректно обрабатывает пустой или невалидный ввод без падений', () => {
		const { container: c1 } = render(<ProseMirrorRenderer doc={null} />);
		expect(c1.firstChild).toBeNull();

		const { container: c2 } = render(
			<ProseMirrorRenderer doc='Просто сырой текст' />
		);
		expect(c2.textContent).toBe('Просто сырой текст');
	});

	describe('sanitizeLinkUrl', () => {
		it('Разрешает безопасные http/https, mailto, tel и относительные ссылки', () => {
			expect(sanitizeLinkUrl('https://human-draft.com')).toBe(
				'https://human-draft.com'
			);
			expect(sanitizeLinkUrl('http://localhost:3000')).toBe(
				'http://localhost:3000'
			);
			expect(sanitizeLinkUrl('mailto:test@example.com')).toBe(
				'mailto:test@example.com'
			);
			expect(sanitizeLinkUrl('tel:+123456789')).toBe('tel:+123456789');
			expect(sanitizeLinkUrl('/posts/123')).toBe('/posts/123');
			expect(sanitizeLinkUrl('#comments')).toBe('#comments');
		});

		it('Блокирует javascript:, vbscript:, data: и blob: протоколы для тегов <a>', () => {
			expect(sanitizeLinkUrl('javascript:alert(1)')).toBe('#');
			expect(sanitizeLinkUrl('  JAVASCRIPT:alert(1)')).toBe('#');
			expect(sanitizeLinkUrl('vbscript:msgbox(1)')).toBe('#');
			expect(sanitizeLinkUrl('data:image/svg+xml;base64,...')).toBe('#');
			expect(sanitizeLinkUrl('blob:http://localhost:3000/123')).toBe('#');
		});
	});

	describe('sanitizeImageUrl', () => {
		it('Разрешает безопасные URL картинок и blob/data:image (кроме SVG)', () => {
			expect(sanitizeImageUrl('https://cdn.example.com/pic.png')).toBe(
				'https://cdn.example.com/pic.png'
			);
			expect(sanitizeImageUrl('/uploads/pic.webp')).toBe(
				'/uploads/pic.webp'
			);
			expect(sanitizeImageUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(
				'data:image/png;base64,iVBORw0KGgo='
			);
			expect(sanitizeImageUrl('blob:http://localhost:3000/blob-id')).toBe(
				'blob:http://localhost:3000/blob-id'
			);
		});

		it('Блокирует data:image/svg variants и javascript: для картинок', () => {
			expect(sanitizeImageUrl('data:image/svg+xml;utf8,<svg>')).toBe('#');
			expect(sanitizeImageUrl('data:image/svg;utf8,<svg>')).toBe('#');
			expect(sanitizeImageUrl('data:image/svg-xml;utf8,<svg>')).toBe('#');
			expect(sanitizeImageUrl('javascript:alert(1)')).toBe('#');
		});
	});
});
