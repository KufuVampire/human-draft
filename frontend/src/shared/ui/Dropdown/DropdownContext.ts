import { createContext, useContext } from 'react';

export interface DropdownContextType {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	close: () => void;
}

export const DropdownContext = createContext<DropdownContextType | null>(null);

export const useDropdown = () => {
	const context = useContext(DropdownContext);
	if (!context) {
		throw new Error('useDropdown must be used within a Dropdown');
	}
	return context;
};
