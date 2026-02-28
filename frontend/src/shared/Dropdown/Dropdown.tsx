'use client';

import {
	Dispatch,
	HTMLAttributes,
	PropsWithChildren,
	ReactNode,
	SetStateAction,
	useRef,
} from 'react';

import { useClickOutside } from '@/hooks';
import { DropdownList } from '@/shared';
import { DisplayDropdownDirection } from '@/types';
import { cn } from '@/utils';

interface Props extends HTMLAttributes<HTMLUListElement> {
	listClassName?: string;
	itemClassName?: string;
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	items: ReactNode[];
	displayDirection?: DisplayDropdownDirection;
}

export const Dropdown = ({
	children,
	isOpen,
	setOpen,
	items,
	itemClassName,
	listClassName,
	displayDirection = 'top-left',
	...props
}: PropsWithChildren<Props>) => {
	const ref = useRef<HTMLDivElement>(null);

	useClickOutside(ref, () => setOpen(false));

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
};
