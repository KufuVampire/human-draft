import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './Pagination';

describe('Pagination', () => {
	it('рендерит навигацию и текущую страницу', () => {
		render(
			<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />
		);
		expect(
			screen.getByRole('navigation', { name: 'Навигация по страницам' })
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Страница 2' })).toHaveAttribute(
			'aria-current',
			'page'
		);
	});

	it('переключает страницу при клике', async () => {
		const handlePageChange = vi.fn();
		render(
			<Pagination
				currentPage={2}
				totalPages={5}
				onPageChange={handlePageChange}
			/>
		);
		await userEvent.click(screen.getByRole('button', { name: 'Страница 3' }));
		expect(handlePageChange).toHaveBeenCalledWith(3);
	});

	it('блокирует кнопку "Предыдущая" на первой странице', () => {
		render(
			<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
		);
		expect(
			screen.getByRole('button', { name: 'Предыдущая страница' })
		).toBeDisabled();
	});
});
