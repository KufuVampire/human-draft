import { create } from 'zustand';

interface InitialState {
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	type: 'post' | 'blog' | 'avatar' | 'poster';
	setType: (type: 'post' | 'blog' | 'avatar' | 'poster') => void;
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
