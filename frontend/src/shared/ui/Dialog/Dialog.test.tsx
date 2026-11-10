import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from './Dialog';

describe('Dialog', () => {
	it('рендерит диалоговое окно когда isOpen=true', () => {
		render(
			<Dialog isOpen onClose={vi.fn()} title='Тестовый диалог'>
				<p>Контент</p>
			</Dialog>
		);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Тестовый диалог')).toBeInTheDocument();
		expect(screen.getByText('Контент')).toBeInTheDocument();
	});

	it('не рендерит диалог когда isOpen=false', () => {
		render(
			<Dialog isOpen={false} onClose={vi.fn()} title='Скрыто'>
				<p>Контент</p>
			</Dialog>
		);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('закрывается по клику на крестик', async () => {
		const handleClose = vi.fn();
		render(
			<Dialog isOpen onClose={handleClose} title='Окно'>
				<p>Контент</p>
			</Dialog>
		);
		const closeBtn = screen.getByRole('button', { name: 'Закрыть окно' });
		await userEvent.click(closeBtn);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it('закрывается по клавише Escape', () => {
		const handleClose = vi.fn();
		render(
			<Dialog isOpen onClose={handleClose} title='Окно'>
				<p>Контент</p>
			</Dialog>
		);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
