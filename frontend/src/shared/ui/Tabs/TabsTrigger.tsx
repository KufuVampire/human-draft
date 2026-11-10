import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from 'react';

import { useTabs } from './TabsContext';
import { cn } from '@/utils';

export interface TabsTriggerProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
}

export const TabsTrigger = forwardRef<
	HTMLButtonElement,
	PropsWithChildren<TabsTriggerProps>
>(({ value, children, className, disabled, onClick, ...props }, ref) => {
	const { value: activeValue, onValueChange } = useTabs();
	const isSelected = activeValue === value;

	return (
		<button
			ref={ref}
			type='button'
			role='tab'
			aria-selected={isSelected}
			disabled={disabled}
			onClick={(e) => {
				onClick?.(e);
				onValueChange?.(value);
			}}
			className={cn(
				'px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary',
				isSelected
					? 'bg-surface-card text-foreground shadow-sm'
					: 'text-placeholder hover:text-foreground',
				disabled && 'opacity-40 cursor-not-allowed',
				className
			)}
			{...props}>
			{children}
		</button>
	);
});

TabsTrigger.displayName = 'TabsTrigger';
