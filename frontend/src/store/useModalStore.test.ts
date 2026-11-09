import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useModalStore } from './useModalStore';

describe('useModalStore', () => {
	beforeEach(() => {
		act(() => {
			useModalStore.getState().closeModal();
		});
	});

	it('начальное состояние — модалки закрыты', () => {
		const state = useModalStore.getState();
		expect(state.activeModal).toBeNull();
		expect(state.modalData).toBeNull();
	});

	it('openModal("needAuth") открывает needAuth без данных', () => {
		act(() => {
			useModalStore.getState().openModal('needAuth');
		});

		const state = useModalStore.getState();
		expect(state.activeModal).toBe('needAuth');
		expect(state.modalData).toBeNull();
	});

	it('openModal("confirmationDeletion", data) сохраняет тип и коллбэк', () => {
		const mockCb = vi.fn();

		act(() => {
			useModalStore.getState().openModal('confirmationDeletion', {
				type: 'post',
				cb: mockCb,
			});
		});

		const state = useModalStore.getState();
		expect(state.activeModal).toBe('confirmationDeletion');
		expect(state.modalData).toEqual({
			type: 'post',
			cb: mockCb,
		});
	});

	it('openModal("confirmationChanges", data) сохраняет коллбэк сохранения', () => {
		const mockCb = vi.fn();

		act(() => {
			useModalStore.getState().openModal('confirmationChanges', {
				cb: mockCb,
			});
		});

		const state = useModalStore.getState();
		expect(state.activeModal).toBe('confirmationChanges');
		expect(state.modalData).toEqual({
			cb: mockCb,
		});
	});

	it('openModal("cropper", data) сохраняет параметры кадрирования', () => {
		const mockCropComplete = vi.fn();
		const mockClose = vi.fn();

		act(() => {
			useModalStore.getState().openModal('cropper', {
				image: 'blob:http://localhost/test-image',
				onCropComplete: mockCropComplete,
				onClose: mockClose,
			});
		});

		const state = useModalStore.getState();
		expect(state.activeModal).toBe('cropper');
		expect(state.modalData).toEqual({
			image: 'blob:http://localhost/test-image',
			onCropComplete: mockCropComplete,
			onClose: mockClose,
		});
	});

	it('closeModal сбрасывает activeModal и modalData в null', () => {
		act(() => {
			useModalStore.getState().openModal('needAuth');
		});
		expect(useModalStore.getState().activeModal).toBe('needAuth');

		act(() => {
			useModalStore.getState().closeModal();
		});

		const state = useModalStore.getState();
		expect(state.activeModal).toBeNull();
		expect(state.modalData).toBeNull();
	});

	it('переключение модалок перезаписывает активную модалку и данные', () => {
		act(() => {
			useModalStore.getState().openModal('needAuth');
		});
		expect(useModalStore.getState().activeModal).toBe('needAuth');

		const mockCb = vi.fn();
		act(() => {
			useModalStore.getState().openModal('confirmationDeletion', {
				type: 'comment',
				cb: mockCb,
			});
		});

		const state = useModalStore.getState();
		expect(state.activeModal).toBe('confirmationDeletion');
		expect(state.modalData).toEqual({
			type: 'comment',
			cb: mockCb,
		});
	});
});
