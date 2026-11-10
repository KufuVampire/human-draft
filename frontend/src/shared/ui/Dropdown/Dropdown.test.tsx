import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
	it('раскрывает меню по клику на триггер', async () => {
		render(
			<Dropdown>
				<Dropdown.Trigger>Открыть меню</Dropdown.Trigger>
				<Dropdown.Content>
					<Dropdown.Item>Пункт 1</Dropdown.Item>
					<Dropdown.Item>Пункт 2</Dropdown.Item>
				</Dropdown.Content>
			</Dropdown>
		);
		const trigger = screen.getByRole('button', { name: 'Открыть меню' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();

		await userEvent.click(trigger);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Пункт 1' })).toBeInTheDocument();
	});

	it('вызывает обработчик элемента и закрывает меню при выборе', async () => {
		const handleClick = vi.fn();
		render(
			<Dropdown defaultOpen>
				<Dropdown.Trigger>Меню</Dropdown.Trigger>
				<Dropdown.Content>
					<Dropdown.Item onClick={handleClick}>Действие</Dropdown.Item>
				</Dropdown.Content>
			</Dropdown>
		);
		const item = screen.getByRole('menuitem', { name: 'Действие' });
		await userEvent.click(item);
		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('закрывает меню по нажатию Escape', () => {
		render(
			<Dropdown defaultOpen>
				<Dropdown.Trigger>Меню</Dropdown.Trigger>
				<Dropdown.Content>
					<Dropdown.Item>Пункт</Dropdown.Item>
				</Dropdown.Content>
			</Dropdown>
		);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});
});
