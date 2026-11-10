import { AlertTriangle } from 'lucide-react';
import {
	PropsWithChildren,
	ReactNode,
	useEffect,
	useId,
	useRef,
	useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';

import { Button } from '../Button/Button';
import { useFocusTrap } from '../utils/useFocusTrap';
import { useScrollLock } from '../utils/useScrollLock';
import { cn } from '@/utils';

export interface AlertDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: ReactNode;
	description: ReactNode;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'primary';
	isLoading?: boolean;
	className?: string;
}

const emptySubscribe = () => () => {};

export const AlertDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	confirmText = 'Подтвердить',
	cancelText = 'Отмена',
	variant = 'danger',
	isLoading = false,
	className,
}: PropsWithChildren<AlertDialogProps>) => {
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
			if (e.key === 'Escape' && !isLoading) onClose();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose, isLoading]);

	if (!isMounted || !isOpen) return null;

	return createPortal(
		<div className='fixed inset-0 z-modal flex items-center justify-center p-4'>
			<div
				className='fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity'
				onClick={() => !isLoading && onClose()}
				aria-hidden='true'
			/>
			<div
				ref={dialogRef}
				role='alertdialog'
				aria-modal='true'
				aria-labelledby={titleId}
				aria-describedby={descId}
				tabIndex={-1}
				className={cn(
					'relative z-10 w-full max-w-md bg-surface-card border border-border-subtle rounded-card p-6 shadow-secondary flex flex-col gap-4 text-foreground outline-none',
					className
				)}>
				<div className='flex items-start gap-3.5'>
					<div
						className={cn(
							'p-2.5 rounded-full shrink-0',
							variant === 'danger'
								? 'bg-error/10 text-error'
								: 'bg-primary/10 text-primary'
						)}>
						<AlertTriangle className='size-5' />
					</div>
					<div className='flex flex-col gap-1'>
						<h2 id={titleId} className='text-base font-title font-bold text-foreground'>
							{title}
						</h2>
						<p id={descId} className='text-sm text-placeholder leading-relaxed'>
							{description}
						</p>
					</div>
				</div>
				<div className='flex items-center justify-end gap-2.5 mt-2'>
					<Button
						variant='secondary'
						size='sm'
						disabled={isLoading}
						onClick={onClose}>
						{cancelText}
					</Button>
					<Button
						variant={variant === 'danger' ? 'danger' : 'primary'}
						size='sm'
						isLoading={isLoading}
						onClick={onConfirm}>
						{confirmText}
					</Button>
				</div>
			</div>
		</div>,
		document.body
	);
};
