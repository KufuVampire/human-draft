import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
	it('рендерит переданный текст', () => {
		render(<Button>Нажми меня</Button>);
		expect(
			screen.getByRole('button', { name: 'Нажми меня' })
		).toBeInTheDocument();
	});

	it('вызывает onClick при клике', async () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Действие</Button>);
		await userEvent.click(screen.getByRole('button', { name: 'Действие' }));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('не вызывает onClick в disabled состоянии', async () => {
		const handleClick = vi.fn();
		render(
			<Button disabled onClick={handleClick}>
				Заблокировано
			</Button>
		);
		const btn = screen.getByRole('button', { name: 'Заблокировано' });
		expect(btn).toBeDisabled();
		await userEvent.click(btn);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('отображает лоадер и блокирует клики при isLoading', async () => {
		const handleClick = vi.fn();
		render(
			<Button isLoading onClick={handleClick}>
				Отправить
			</Button>
		);
		const btn = screen.getByRole('button');
		expect(btn).toHaveAttribute('aria-busy', 'true');
		expect(btn).toBeDisabled();
		await userEvent.click(btn);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('активируется клавишами Enter и Space с клавиатуры', async () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Клавиша</Button>);
		const btn = screen.getByRole('button', { name: 'Клавиша' });
		btn.focus();
		expect(btn).toHaveFocus();
		fireEvent.keyDown(btn, { key: 'Enter', code: 'Enter' });
		fireEvent.click(btn);
		expect(handleClick).toHaveBeenCalled();
	});
});
