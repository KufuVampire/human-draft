import { ButtonHTMLAttributes, forwardRef, PropsWithChildren, ReactNode } from 'react';

import { useDropdown } from './DropdownContext';
import { cn } from '@/utils';

export interface DropdownItemProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: ReactNode;
	variant?: 'default' | 'danger';
}

export const DropdownItem = forwardRef<
	HTMLButtonElement,
	PropsWithChildren<DropdownItemProps>
>(({ children, className, icon, variant = 'default', onClick, disabled, ...props }, ref) => {
	const { close } = useDropdown();

	return (
		<button
			ref={ref}
			role='menuitem'
			disabled={disabled}
			onClick={(e) => {
				if (disabled) return;
				onClick?.(e);
				close();
			}}
			className={cn(
				'w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left transition-colors cursor-pointer select-none outline-none',
				variant === 'default' &&
					'text-foreground hover:bg-surface-tag focus-visible:bg-surface-tag',
				variant === 'danger' &&
					'text-error hover:bg-error/10 focus-visible:bg-error/10',
				disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
				className
			)}
			{...props}>
			{icon && <span className='shrink-0'>{icon}</span>}
			<span className='flex-1'>{children}</span>
		</button>
	);
});

DropdownItem.displayName = 'DropdownItem';
