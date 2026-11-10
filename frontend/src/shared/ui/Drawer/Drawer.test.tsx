import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Drawer } from './Drawer';

describe('Drawer', () => {
	it('рендерит панель при isOpen=true', () => {
		render(
			<Drawer isOpen onClose={vi.fn()} title='Мобильная шторка'>
				<p>Содержимое</p>
			</Drawer>
		);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Мобильная шторка')).toBeInTheDocument();
	});

	it('закрывается по клику на крестик', async () => {
		const handleClose = vi.fn();
		render(
			<Drawer isOpen onClose={handleClose} title='Шторка'>
				<p>Текст</p>
			</Drawer>
		);
		const closeBtn = screen.getByRole('button', { name: 'Закрыть панель' });
		await userEvent.click(closeBtn);
		expect(handleClose).toHaveBeenCalled();
	});

	it('закрывается по клавише Escape', () => {
		const handleClose = vi.fn();
		render(
			<Drawer isOpen onClose={handleClose} title='Шторка'>
				<p>Текст</p>
			</Drawer>
		);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(handleClose).toHaveBeenCalled();
	});
});
