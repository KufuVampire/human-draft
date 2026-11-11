import { Dispatch, SetStateAction } from 'react';

import { Button } from '../../Button/Button';
import { cn } from '@/utils';

interface Props {
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const lineStyles =
	'h-0.5 w-5 bg-foreground block transition-all duration-200 rounded-full origin-center';

export const Burger = ({ isOpen, setOpen }: Props) => {
	return (
		<Button
			variant='clear'
			onClick={() => setOpen((prev) => !prev)}
			aria-label='Меню навигации'
			className='flex flex-col justify-center items-center gap-1 size-8 rounded-lg hover:bg-surface-tag text-foreground transition-colors'>
			<span
				className={cn(lineStyles, isOpen && 'rotate-45 translate-y-1.5')}
			/>
			<span
				className={cn(lineStyles, isOpen && 'opacity-0')}
			/>
			<span
				className={cn(lineStyles, isOpen && '-rotate-45 -translate-y-1.5')}
			/>
		</Button>
	);
};
