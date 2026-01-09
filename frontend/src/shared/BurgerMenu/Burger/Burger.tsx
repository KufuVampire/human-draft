import { Dispatch, SetStateAction } from 'react';

import { Button } from '@/shared';
import { cn } from '@/utils';

interface Props {
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const burgerIconStyles =
	'h-0.5 w-6 bg-secondary block transition-transform duration-300 rounded-full absolute top-1/2';

export const Burger = ({ isOpen, setOpen }: Props) => {
	return (
		<Button
			variant='clear'
			onClick={() => setOpen((prev) => !prev)}
			className='flex flex-col gap-1 size-6 relative transform-3d'>
			<span
				className={cn(
					burgerIconStyles,
					'translate-x-0 -translate-y-2 translate-z-0',
					{
						['rotate-45 translate-0 translate-z-0']: isOpen,
					}
				)}
			/>
			<span
				className={cn(burgerIconStyles, 'translate-0 translate-z-0', {
					['scale-x-0 scale-y-100 translate-0 translate-z-0']: isOpen,
				})}
			/>
			<span
				className={cn(
					burgerIconStyles,
					'translate-x-0 translate-y-2 translate-z-0',
					{
						['-rotate-45 translate-0 translate-z-0']: isOpen,
					}
				)}
			/>
		</Button>
	);
};
