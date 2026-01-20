import { create } from 'zustand';

interface InitialProps {
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	cb: () => void;
	setCb: (cb: () => void) => void;
}

export const useConfirmationChangesModal = create<InitialProps>((set) => ({
	isOpen: false,
	setOpen: (isOpen: boolean) => set({ isOpen }),
	cb: () => {},
	setCb: (cb) => set({ cb }),
}));
