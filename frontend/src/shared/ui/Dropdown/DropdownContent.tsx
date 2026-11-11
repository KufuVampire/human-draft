import { HTMLAttributes, PropsWithChildren, useEffect, useRef } from 'react';

import { useDropdown } from './DropdownContext';
import { cn } from '@/utils';

export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
	align?: 'start' | 'end' | 'center';
}

export const DropdownContent = ({
	align = 'start',
	className,
	children,
	...props
}: PropsWithChildren<DropdownContentProps>) => {
	const { isOpen, close } = useDropdown();
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, close]);

	if (!isOpen) return null;

	const alignClasses = {
		start: 'left-0',
		end: 'right-0',
		center: 'left-1/2 -translate-x-1/2',
	};

	return (
		<div
			ref={contentRef}
			role='menu'
			className={cn(
				'absolute z-dropdown mt-1.5 min-w-44 rounded-xl border border-border-subtle bg-surface-card p-1 shadow-primary text-foreground outline-none animate-dropdown-enter origin-top flex flex-col',
				alignClasses[align],
				className
			)}
			{...props}>
			{children}
		</div>
	);
};
