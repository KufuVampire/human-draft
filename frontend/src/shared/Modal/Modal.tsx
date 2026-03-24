'use client';

import { PropsWithChildren, useEffect } from 'react';

import { cn } from '@/utils';

interface Props {
	isOpen: boolean;
}

export const Modal = ({ children, isOpen }: PropsWithChildren<Props>) => {
	useEffect(() => {
		if (isOpen) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}, [isOpen]);

	return (
		<div
			className={cn(
				'fixed bg-[rgba(0,0,0,0.4)] inset-0 flex items-center justify-center z-modal',
				!isOpen && 'hidden'
			)}>
			{children}
		</div>
	);
};
