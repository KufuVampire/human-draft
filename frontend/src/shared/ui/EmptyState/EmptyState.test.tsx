import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
	it('рендерит заголовок и описание', () => {
		render(
			<EmptyState
				title='Список пуст'
				description='Добавьте элементы для отображения'
			/>
		);
		expect(screen.getByText('Список пуст')).toBeInTheDocument();
		expect(
			screen.getByText('Добавьте элементы для отображения')
		).toBeInTheDocument();
	});

	it('рендерит переданное действие', () => {
		render(
			<EmptyState
				title='Пусто'
				action={<button type='button'>Создать</button>}
			/>
		);
		expect(screen.getByRole('button', { name: 'Создать' })).toBeInTheDocument();
	});
});
