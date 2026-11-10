import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
	it('рендерит навигационную цепочку с правильной разметкой', () => {
		render(
			<Breadcrumbs>
				<Breadcrumbs.Item>
					<Breadcrumbs.Link href='/'>Главная</Breadcrumbs.Link>
				</Breadcrumbs.Item>
				<Breadcrumbs.Separator />
				<Breadcrumbs.Item>
					<Breadcrumbs.Link isCurrent>Текущая страница</Breadcrumbs.Link>
				</Breadcrumbs.Item>
			</Breadcrumbs>
		);
		expect(
			screen.getByRole('navigation', { name: 'Хлебные крошки' })
		).toBeInTheDocument();
		expect(screen.getByText('Главная')).toBeInTheDocument();
		const current = screen.getByText('Текущая страница');
		expect(current).toHaveAttribute('aria-current', 'page');
	});
});
