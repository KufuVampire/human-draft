import {
	HTMLAttributes,
	PropsWithChildren,
	ReactNode,
	forwardRef,
} from 'react';

import { DropdownList } from '../DropdownList/DropdownList';

import { DisplayDropdownDirection } from '@/types';
import { cn } from '@/utils';

interface Props extends HTMLAttributes<HTMLUListElement> {
	dropdownClassName?: string;
	listClassName?: string;
	itemClassName?: string;
	isOpen: boolean;
	items: ReactNode[];
	displayDirection?: DisplayDropdownDirection;
}

export const Dropdown = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
	(
		{
			children,
			isOpen,
			items,
			itemClassName,
			listClassName,
			displayDirection = 'top-left',
			...props
		}: PropsWithChildren<Props>,
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn('flex flex-col relative', props.className)}>
				{children}

				<DropdownList
					isOpen={isOpen}
					items={items}
					listClassName={listClassName}
					itemClassName={itemClassName}
					displayDirection={displayDirection}
					{...props}
				/>
			</div>
		);
	}
);

Dropdown.displayName = 'Dropdown';
