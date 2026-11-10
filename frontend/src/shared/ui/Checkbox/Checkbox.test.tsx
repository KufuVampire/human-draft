import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
	it('рендерит чекбокс с меткой', () => {
		render(<Checkbox label='Принять условия' />);
		expect(screen.getByLabelText('Принять условия')).toBeInTheDocument();
	});

	it('переключает состояние при клике', async () => {
		const handleChange = vi.fn();
		render(<Checkbox label='Опция' onChange={handleChange} />);
		const checkbox = screen.getByLabelText('Опция');
		expect(checkbox).not.toBeChecked();
		await userEvent.click(checkbox);
		expect(handleChange).toHaveBeenCalled();
	});

	it('поддерживает indeterminate состояние', () => {
		render(<Checkbox label='Частичный выбор' indeterminate />);
		const checkbox = screen.getByLabelText('Частичный выбор');
		expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
	});

	it('блокирует переключение при disabled', async () => {
		const handleChange = vi.fn();
		render(<Checkbox label='Заблокировано' disabled onChange={handleChange} />);
		const checkbox = screen.getByLabelText('Заблокировано');
		expect(checkbox).toBeDisabled();
		await userEvent.click(checkbox);
		expect(handleChange).not.toHaveBeenCalled();
	});
});
