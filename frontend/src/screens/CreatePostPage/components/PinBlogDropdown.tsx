'use client';

import { ChevronDown } from 'lucide-react';
import type { Dispatch, MouseEvent, ReactNode, SetStateAction } from 'react';

import { Button, Dropdown } from '@/shared';
import { cn } from '@/utils';

interface Props {
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	items: ReactNode[];
	buttonText: string;
	onPickBlog: (e: MouseEvent<HTMLUListElement>) => void;
}

export const PinBlogDropdown = ({
	isOpen,
	setOpen,
	items,
	buttonText,
	onPickBlog,
}: Props) => {
	return (
		<Dropdown
			isOpen={isOpen}
			items={items}
			setOpen={setOpen}
			className='flex-1 sm:flex-none'
			listClassName='w-64 overflow-y-auto max-h-60 py-3 px-2.5 shadow-secondary'
			itemClassName='first:mb-1'
			onClick={onPickBlog}
			displayDirection='bottom'>
			<Button
				variant='secondary'
				className='bg-surface-card px-5 py-2 flex gap-x-5 rounded-lg w-full text-nowrap'
				onClick={() => setOpen((prev) => !prev)}
				type='button'>
				<span className='w-full inline-block text-left'>{buttonText}</span>
				<ChevronDown
					className={cn(
						'transition-transform shrink-0',
						isOpen && 'rotate-180'
					)}
				/>
			</Button>
		</Dropdown>
	);
};
