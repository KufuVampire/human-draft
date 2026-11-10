import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AlertDialog } from './AlertDialog';

describe('AlertDialog', () => {
	it('рендерит диалог подтверждения с заголовком и описанием', () => {
		render(
			<AlertDialog
				isOpen
				onClose={vi.fn()}
				onConfirm={vi.fn()}
				title='Удаление'
				description='Вы уверены?'
			/>
		);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		expect(screen.getByText('Удаление')).toBeInTheDocument();
		expect(screen.getByText('Вы уверены?')).toBeInTheDocument();
	});

	it('вызывает onConfirm при нажатии кнопки подтверждения', async () => {
		const handleConfirm = vi.fn();
		render(
			<AlertDialog
				isOpen
				onClose={vi.fn()}
				onConfirm={handleConfirm}
				title='Подтвердить'
				description='Описание'
				confirmText='Да'
			/>
		);
		const confirmBtn = screen.getByRole('button', { name: 'Да' });
		await userEvent.click(confirmBtn);
		expect(handleConfirm).toHaveBeenCalledTimes(1);
	});

	it('вызывает onClose при нажатии отмены или Escape', async () => {
		const handleClose = vi.fn();
		render(
			<AlertDialog
				isOpen
				onClose={handleClose}
				onConfirm={vi.fn()}
				title='Отмена'
				description='Описание'
				cancelText='Нет'
			/>
		);
		const cancelBtn = screen.getByRole('button', { name: 'Нет' });
		await userEvent.click(cancelBtn);
		expect(handleClose).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(document, { key: 'Escape' });
		expect(handleClose).toHaveBeenCalledTimes(2);
	});
});
