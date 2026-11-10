import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './Select';

const testOptions = [
	{ value: 'react', label: 'React 19' },
	{ value: 'vue', label: 'Vue 3' },
	{ value: 'angular', label: 'Angular', disabled: true },
];

describe('Select', () => {
	it('рендерит селект с плейсхолдером', () => {
		render(<Select options={testOptions} placeholder='Выберите фреймворк' />);
		expect(
			screen.getByRole('combobox', { name: /Выберите фреймворк/i })
		).toBeInTheDocument();
	});

	it('раскрывает список опций по клику и выбирает значение', async () => {
		const handleChange = vi.fn();
		render(
			<Select
				options={testOptions}
				placeholder='Выбор'
				onChange={handleChange}
			/>
		);
		const trigger = screen.getByRole('combobox');
		await userEvent.click(trigger);
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		const option = screen.getByRole('option', { name: 'React 19' });
		await userEvent.click(option);
		expect(handleChange).toHaveBeenCalledWith('react');
	});

	it('поддерживает навигацию с клавиатуры: стрелки, Enter, Escape', () => {
		const handleChange = vi.fn();
		render(
			<Select
				options={testOptions}
				placeholder='Выбор'
				onChange={handleChange}
			/>
		);
		const trigger = screen.getByRole('combobox');
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		fireEvent.keyDown(trigger, { key: 'Enter' });
		expect(handleChange).toHaveBeenCalledWith('react');

		fireEvent.keyDown(trigger, { key: 'ArrowDown' });
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		fireEvent.keyDown(trigger, { key: 'Escape' });
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});
});
