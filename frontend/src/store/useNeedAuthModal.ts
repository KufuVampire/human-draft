import { create } from 'zustand';

interface InitialState {
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
}

export const useNeedAuthModal = create<InitialState>((set) => ({
	isOpen: false,
	setOpen: (isOpen) => set({ isOpen }),
}));
