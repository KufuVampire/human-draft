'use client';

import { create } from 'zustand';

export type ModalType =
	| 'confirmationChanges'
	| 'confirmationDeletion'
	| 'needAuth'
	| 'cropper';

export type DeletionType = 'post' | 'blog' | 'avatar' | 'poster' | 'comment';

export interface ConfirmationDeletionData {
	type: DeletionType;
	cb: () => void;
}

export interface ConfirmationChangesData {
	cb: () => void;
}

export interface CropperData {
	image: string;
	onCropComplete?: (file: File) => void;
	onClose?: () => void;
}

export interface ModalDataMap {
	confirmationChanges: ConfirmationChangesData;
	confirmationDeletion: ConfirmationDeletionData;
	needAuth: undefined;
	cropper: CropperData;
}

export interface ModalState {
	activeModal: ModalType | null;
	modalData: unknown;
	openModal: <T extends ModalType>(
		type: T,
		...args: ModalDataMap[T] extends undefined ? [] : [data: ModalDataMap[T]]
	) => void;
	closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
	activeModal: null,
	modalData: null,
	openModal: (type, ...args) =>
		set({ activeModal: type, modalData: args[0] ?? null }),
	closeModal: () => set({ activeModal: null, modalData: null }),
}));

export const useModalData = <T extends ModalType>(
	type: T
): ModalDataMap[T] | null =>
	useModalStore((s) =>
		s.activeModal === type ? (s.modalData as ModalDataMap[T]) : null
	);
