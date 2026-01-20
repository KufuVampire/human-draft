import { PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	isOpen: boolean;
}

export const Modal = ({ children, isOpen }: PropsWithChildren<Props>) => {
	return (
		<div
			className={cn(
				'fixed bg-[rgba(0,0,0,0.4)] inset-0 flex items-center justify-center z-50',
				!isOpen && 'hidden'
			)}>
			{children}
		</div>
	);
};
