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

const originMap: Record<DisplayDropdownDirection, string> = {
	top: 'origin-top',
	'top-left': 'origin-top-left',
	'top-right': 'origin-top-right',
	bottom: 'origin-bottom',
	'bottom-left': 'origin-bottom-left',
	'bottom-right': 'origin-bottom-right',
	left: 'origin-left',
	right: 'origin-right',
	center: 'origin-center',
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
					'absolute top-[calc(100%+0.75rem)] right-0 z-dropdown flex flex-col min-w-max rounded-xl bg-[var(--background-color-card)] scale-0 transition-all opacity-0 duration-200 shadow-primary',
					originMap[displayDirection],
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
