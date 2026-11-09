import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

describe('Modal (портал и шторка)', () => {
	beforeEach(() => {
		document.body.className = '';
		vi.clearAllMocks();
	});

	it('рендерит содержимое в document.body через портал при isOpen=true', () => {
		render(
			<Modal isOpen={true}>
				<div data-testid='modal-content'>Тестовое окно</div>
			</Modal>
		);

		const content = screen.getByTestId('modal-content');
		expect(content).toBeInTheDocument();
		expect(document.body.contains(content)).toBe(true);
	});

	it('не рендерит содержимое при isOpen=false', () => {
		render(
			<Modal isOpen={false}>
				<div data-testid='modal-content'>Тестовое окно</div>
			</Modal>
		);

		expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
	});

	it('добавляет overflow-hidden к body при открытии и удаляет при закрытии/размонтировании', () => {
		const { rerender, unmount } = render(
			<Modal isOpen={true}>
				<div>Контент</div>
			</Modal>
		);

		expect(document.body.classList.contains('overflow-hidden')).toBe(true);

		rerender(
			<Modal isOpen={false}>
				<div>Контент</div>
			</Modal>
		);

		expect(document.body.classList.contains('overflow-hidden')).toBe(false);

		rerender(
			<Modal isOpen={true}>
				<div>Контент</div>
			</Modal>
		);

		expect(document.body.classList.contains('overflow-hidden')).toBe(true);
		unmount();
		expect(document.body.classList.contains('overflow-hidden')).toBe(false);
	});

	it('вызывает onClose при нажатии клавиши Escape', () => {
		const handleClose = vi.fn();

		render(
			<Modal isOpen={true} onClose={handleClose}>
				<div>Контент</div>
			</Modal>
		);

		fireEvent.keyDown(window, { key: 'Escape' });
		expect(handleClose).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(window, { key: 'Enter' });
		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
