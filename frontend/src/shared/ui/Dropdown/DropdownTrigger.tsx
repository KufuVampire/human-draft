import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from 'react';

import { useDropdown } from './DropdownContext';
import { cn } from '@/utils';

export interface DropdownTriggerProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const DropdownTrigger = forwardRef<
	HTMLButtonElement,
	PropsWithChildren<DropdownTriggerProps>
>(({ children, className, onClick, ...props }, ref) => {
	const { isOpen, setIsOpen } = useDropdown();

	return (
		<button
			ref={ref}
			type='button'
			aria-haspopup='menu'
			aria-expanded={isOpen}
			onClick={(e) => {
				onClick?.(e);
				setIsOpen(!isOpen);
			}}
			className={cn('inline-flex items-center cursor-pointer', className)}
			{...props}>
			{children}
		</button>
	);
});

DropdownTrigger.displayName = 'DropdownTrigger';
