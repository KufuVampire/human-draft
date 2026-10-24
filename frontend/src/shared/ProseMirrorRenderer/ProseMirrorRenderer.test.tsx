import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
	ProseMirrorNodeJSON,
	ProseMirrorRenderer,
	sanitizeUrl,
} from './ProseMirrorRenderer';

describe('ProseMirrorRenderer (colocated unit tests)', () => {
	it('Рендерит базовые текстовые блоки и заголовки', () => {
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

		render(<ProseMirrorRenderer doc={doc} />);

		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
			'Заголовок статьи'
		);
		expect(screen.getByText('жирный текст').tagName).toBe('STRONG');
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

	it('Нейтрализует вредоносные ссылки javascript: в ссылках', () => {
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
					],
				},
			],
		};

		render(<ProseMirrorRenderer doc={maliciousLinkDoc} />);

		const link = screen.getByRole('link', { name: 'Опасная ссылка' });
		expect(link).toHaveAttribute('href', '#');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('Корректно обрабатывает пустой или невалидный ввод без падений', () => {
		const { container: c1 } = render(<ProseMirrorRenderer doc={null} />);
		expect(c1.firstChild).toBeNull();

		const { container: c2 } = render(
			<ProseMirrorRenderer doc='Просто сырой текст' />
		);
		expect(c2.textContent).toBe('Просто сырой текст');
	});

	describe('sanitizeUrl', () => {
		it('Разрешает безопасные http/https и относительные ссылки', () => {
			expect(sanitizeUrl('https://human-draft.com')).toBe(
				'https://human-draft.com'
			);
			expect(sanitizeUrl('http://localhost:3000')).toBe(
				'http://localhost:3000'
			);
			expect(sanitizeUrl('/posts/123')).toBe('/posts/123');
			expect(sanitizeUrl('#comments')).toBe('#comments');
		});

		it('Блокирует javascript: и vbscript: протоколы', () => {
			expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
			expect(sanitizeUrl('  JAVASCRIPT:alert(1)')).toBe('#');
			expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
		});
	});
});
