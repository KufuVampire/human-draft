import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
	it('рендерит поле поиска', () => {
		render(<SearchInput placeholder='Поиск...' />);
		expect(screen.getByPlaceholderText('Поиск...')).toBeInTheDocument();
	});

	it('отображает кнопку очистки при наличии текста и очищает поле по клику', async () => {
		const handleClear = vi.fn();
		render(
			<SearchInput
				placeholder='Поиск'
				defaultValue='React'
				onClear={handleClear}
			/>
		);
		const clearBtn = screen.getByRole('button', { name: 'Очистить поиск' });
		expect(clearBtn).toBeInTheDocument();
		await userEvent.click(clearBtn);
		expect(handleClear).toHaveBeenCalled();
	});

	it('очищает поиск по клавише Escape', () => {
		const handleClear = vi.fn();
		render(
			<SearchInput
				placeholder='Поиск'
				defaultValue='GraphQL'
				onClear={handleClear}
			/>
		);
		const input = screen.getByPlaceholderText('Поиск');
		fireEvent.keyDown(input, { key: 'Escape' });
		expect(handleClear).toHaveBeenCalled();
	});
});
