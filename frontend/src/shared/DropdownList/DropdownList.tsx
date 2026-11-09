import { HTMLAttributes, ReactNode, memo } from 'react';

import { DropdownItem } from './DropdownItem/DropdownItem';
import { DisplayDropdownDirection } from '@/types';
import { cn } from '@/utils';

interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'className'> {
	listClassName?: string;
	itemClassName?: string;
	isOpen: boolean;
	items: ReactNode[];
	displayDirection: DisplayDropdownDirection;
}

const directionPositionMap: Record<DisplayDropdownDirection, string> = {
	top: 'bottom-[calc(100%+0.5rem)] top-auto left-0 origin-bottom',
	'top-left': 'top-[calc(100%+0.75rem)] left-0 origin-top-left',
	'top-right': 'top-[calc(100%+0.75rem)] right-0 origin-top-right',
	bottom: 'top-[calc(100%+0.5rem)] left-0 origin-top',
	'bottom-left': 'bottom-[calc(100%+0.75rem)] left-0 top-auto origin-bottom-left',
	'bottom-right': 'bottom-[calc(100%+0.75rem)] right-0 top-auto origin-bottom-right',
	left: 'right-[calc(100%+0.5rem)] top-0 origin-right',
	right: 'left-[calc(100%+0.5rem)] top-0 origin-left',
	center: 'top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 origin-center',
};

export const DropdownList = memo(
	({
		listClassName,
		itemClassName,
		isOpen,
		items,
		displayDirection,
		...props
	}: Props) => {
		return (
			<ul
				{...props}
				className={cn(
					'absolute z-dropdown flex flex-col min-w-max max-w-[calc(100vw-2rem)] max-h-72 overflow-y-auto rounded-xl bg-[var(--background-color-card)] scale-0 transition-all opacity-0 duration-200 shadow-primary',
					directionPositionMap[displayDirection],
					{
						['scale-100 opacity-100']: isOpen,
					},
					listClassName
				)}>
				{items.map((Component, i) => (
					<DropdownItem
						key={i}
						className={itemClassName}>
						{Component}
					</DropdownItem>
				))}
			</ul>
		);
	}
);

DropdownList.displayName = 'DropdownList';
