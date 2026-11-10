import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './Switch';

describe('Switch', () => {
	it('рендерит переключатель с правильным aria-checked', () => {
		render(<Switch label='Включить режим' checked />);
		const switchBtn = screen.getByRole('switch');
		expect(switchBtn).toBeInTheDocument();
		expect(switchBtn).toHaveAttribute('aria-checked', 'true');
	});

	it('вызывает onChange при клике', async () => {
		const handleChange = vi.fn();
		render(<Switch label='Тумблер' checked={false} onChange={handleChange} />);
		await userEvent.click(screen.getByRole('switch'));
		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it('переключается по нажатию Space и Enter', () => {
		const handleChange = vi.fn();
		render(<Switch label='Тумблер' checked={false} onChange={handleChange} />);
		const switchBtn = screen.getByRole('switch');
		fireEvent.keyDown(switchBtn, { key: ' ', code: 'Space' });
		expect(handleChange).toHaveBeenCalledWith(true);
		fireEvent.keyDown(switchBtn, { key: 'Enter', code: 'Enter' });
		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it('не срабатывает при disabled', async () => {
		const handleChange = vi.fn();
		render(
			<Switch label='Блок' disabled checked={false} onChange={handleChange} />
		);
		const switchBtn = screen.getByRole('switch');
		expect(switchBtn).toBeDisabled();
		await userEvent.click(switchBtn);
		expect(handleChange).not.toHaveBeenCalled();
	});
});
