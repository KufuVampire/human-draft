import {
	HTMLAttributes,
	PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from 'react';

import { DropdownContent } from './DropdownContent';
import { DropdownContext } from './DropdownContext';
import { DropdownItem } from './DropdownItem';
import { DropdownSeparator } from './DropdownSeparator';
import { DropdownTrigger } from './DropdownTrigger';
import { cn } from '@/utils';

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const Dropdown = ({
	defaultOpen = false,
	open,
	onOpenChange,
	className,
	children,
	...props
}: PropsWithChildren<DropdownProps>) => {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const containerRef = useRef<HTMLDivElement>(null);

	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;

	const setIsOpen = (nextOpen: boolean) => {
		if (!isControlled) {
			setInternalOpen(nextOpen);
		}
		onOpenChange?.(nextOpen);
	};

	const close = () => setIsOpen(false);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				close();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<DropdownContext.Provider value={{ isOpen, setIsOpen, close }}>
			<div
				ref={containerRef}
				className={cn('relative inline-block text-left', className)}
				{...props}>
				{children}
			</div>
		</DropdownContext.Provider>
	);
};

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
Dropdown.Separator = DropdownSeparator;
