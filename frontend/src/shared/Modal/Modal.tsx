'use client';

import { PropsWithChildren, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils';

interface Props {
	isOpen: boolean;
	onClose?: () => void;
	className?: string;
}

const emptySubscribe = () => () => {};

export const Modal = ({
	children,
	isOpen,
	onClose,
	className,
}: PropsWithChildren<Props>) => {
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}

		return () => {
			document.body.classList.remove('overflow-hidden');
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen || !onClose) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!mounted || !isOpen) return null;

	return createPortal(
		<div
			role='dialog'
			aria-modal='true'
			className={cn(
				'fixed inset-0 z-modal bg-[rgba(0,0,0,0.5)] backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4',
				className
			)}>
			{children}
		</div>,
		document.body
	);
};
