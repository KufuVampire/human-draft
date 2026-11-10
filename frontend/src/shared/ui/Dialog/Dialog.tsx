import { X } from 'lucide-react';
import {
	PropsWithChildren,
	ReactNode,
	useEffect,
	useId,
	useRef,
	useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';

import { useFocusTrap } from '../utils/useFocusTrap';
import { useScrollLock } from '../utils/useScrollLock';
import { cn } from '@/utils';

export interface DialogProps {
	isOpen: boolean;
	onClose: () => void;
	title?: ReactNode;
	description?: ReactNode;
	className?: string;
}

const emptySubscribe = () => () => {};

export const Dialog = ({
	isOpen,
	onClose,
	title,
	description,
	className,
	children,
}: PropsWithChildren<DialogProps>) => {
	const dialogRef = useRef<HTMLDivElement>(null);
	const titleId = useId();
	const descId = useId();

	const isMounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false
	);

	useScrollLock(isOpen);
	useFocusTrap(dialogRef, isOpen);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isMounted || !isOpen) return null;

	return createPortal(
		<div className='fixed inset-0 z-modal flex items-center justify-center p-4'>
			<div
				className='fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity'
				onClick={onClose}
				aria-hidden='true'
			/>
			<div
				ref={dialogRef}
				role='dialog'
				aria-modal='true'
				aria-labelledby={title ? titleId : undefined}
				aria-describedby={description ? descId : undefined}
				tabIndex={-1}
				className={cn(
					'relative z-10 w-full max-w-lg bg-surface-card border border-border-subtle rounded-card p-6 shadow-secondary flex flex-col gap-4 text-foreground outline-none',
					className
				)}>
				<div className='flex items-start justify-between gap-4'>
					<div className='flex flex-col gap-1'>
						{title && (
							<h2
								id={titleId}
								className='text-lg font-title font-bold text-foreground'>
								{title}
							</h2>
						)}
						{description && (
							<p id={descId} className='text-sm text-placeholder'>
								{description}
							</p>
						)}
					</div>
					<button
						type='button'
						onClick={onClose}
						aria-label='Закрыть окно'
						className='shrink-0 p-1 rounded-lg text-placeholder hover:text-foreground hover:bg-surface-tag transition-colors cursor-pointer'>
						<X className='size-5' />
					</button>
				</div>
				<div>{children}</div>
			</div>
		</div>,
		document.body
	);
};
