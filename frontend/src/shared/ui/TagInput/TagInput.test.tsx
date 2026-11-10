import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TagInput } from './TagInput';

describe('TagInput', () => {
	it('рендерит переданные теги', () => {
		render(<TagInput tags={['react', 'vite']} onChange={vi.fn()} />);
		expect(screen.getByText('#react')).toBeInTheDocument();
		expect(screen.getByText('#vite')).toBeInTheDocument();
	});

	it('добавляет новый тег по нажатию Enter', async () => {
		const handleChange = vi.fn();
		render(<TagInput tags={['react']} onChange={handleChange} />);
		const input = screen.getByRole('textbox');
		await userEvent.type(input, 'tailwind{enter}');
		expect(handleChange).toHaveBeenCalledWith(['react', 'tailwind']);
	});

	it('удаляет тег по клику на кнопку удаления', async () => {
		const handleChange = vi.fn();
		render(<TagInput tags={['react', 'vue']} onChange={handleChange} />);
		const removeBtn = screen.getByRole('button', {
			name: 'Удалить тег react',
		});
		await userEvent.click(removeBtn);
		expect(handleChange).toHaveBeenCalledWith(['vue']);
	});

	it('удаляет последний тег по клавише Backspace на пустом вводе', () => {
		const handleChange = vi.fn();
		render(<TagInput tags={['one', 'two']} onChange={handleChange} />);
		const input = screen.getByRole('textbox');
		fireEvent.keyDown(input, { key: 'Backspace' });
		expect(handleChange).toHaveBeenCalledWith(['one']);
	});
});
