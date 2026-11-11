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
	top: 'bottom-full mb-2 left-0 origin-bottom',
	'top-left': 'top-full mt-3 left-0 origin-top-left',
	'top-right': 'top-full mt-3 right-0 origin-top-right',
	bottom: 'top-full mt-2 left-0 origin-top',
	'bottom-left': 'bottom-full mb-3 left-0 origin-bottom-left',
	'bottom-right': 'bottom-full mb-3 right-0 origin-bottom-right',
	left: 'right-full mr-2 top-0 origin-right',
	right: 'left-full ml-2 top-0 origin-left',
	center: 'top-full mt-2 left-1/2 -translate-x-1/2 origin-center',
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
					'absolute z-dropdown flex flex-col w-max max-w-xs sm:max-w-sm max-h-72 overflow-y-auto rounded-xl bg-surface-card border border-border-subtle scale-0 transition-all opacity-0 duration-200 shadow-md',
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
