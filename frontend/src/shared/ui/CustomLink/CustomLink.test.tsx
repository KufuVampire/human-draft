import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CustomLink } from './CustomLink';

describe('CustomLink', () => {
	it('рендерит ссылку с переданным текстом и href', () => {
		render(<CustomLink href='/home'>Главная</CustomLink>);
		const link = screen.getByRole('link', { name: 'Главная' });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/home');
	});

	it('добавляет target="_blank" и rel="noopener noreferrer" при external=true', () => {
		render(
			<CustomLink href='https://example.com' external>
				Внешняя ссылка
			</CustomLink>
		);
		const link = screen.getByRole('link', { name: 'Внешняя ссылка' });
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});
});
