import { create } from 'zustand';

type ModalTextType = 'post' | 'blog' | 'avatar' | 'poster' | 'comment';

interface InitialState {
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	type: ModalTextType;
	setType: (type: ModalTextType) => void;
	cb: () => void;
	setCb: (cb: () => void) => void;
}

export const useConfirmationDeletionModal = create<InitialState>((set) => ({
	isOpen: false,
	setOpen: (isOpen) => set({ isOpen }),
	type: 'avatar',
	setType: (type) => set({ type }),
	cb: () => {},
	setCb: (cb) => set({ cb }),
}));
