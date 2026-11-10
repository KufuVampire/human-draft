'use client';

import { ChevronDown } from 'lucide-react';
import type { Dispatch, MouseEvent, ReactNode, SetStateAction } from 'react';

import { Button, Dropdown } from '@/shared';
import { cn } from '@/utils';

interface Props {
	items: ReactNode[];
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	buttonText: string;
	onClick: (e: MouseEvent<HTMLUListElement>) => void;
}

export const BlogPinnedPostsDropdown = ({
	items,
	isOpen,
	setOpen,
	buttonText,
	onClick,
}: Props) => {
	return (
		<Dropdown
			items={items}
			isOpen={isOpen}
			setOpen={setOpen}
			listClassName='w-full top-[calc(100%+0.5rem)] overflow-hidden py-3 px-2.5 shadow-secondary'
			onClick={onClick}>
			<Button
				variant='secondary'
				className='py-2 px-5 rounded-lg justify-between'
				onClick={() => setOpen((prev) => !prev)}
				type='button'>
				{buttonText}
				<ChevronDown
					className={cn(
						'transition-transform',
						isOpen && 'rotate-180'
					)}
				/>
			</Button>
		</Dropdown>
	);
};
