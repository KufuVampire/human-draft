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

export type DrawerPlacement = 'bottom' | 'right' | 'left';

export interface DrawerProps {
	isOpen: boolean;
	onClose: () => void;
	title?: ReactNode;
	placement?: DrawerPlacement;
	className?: string;
}

const emptySubscribe = () => () => {};

export const Drawer = ({
	isOpen,
	onClose,
	title,
	placement = 'bottom',
	className,
	children,
}: PropsWithChildren<DrawerProps>) => {
	const drawerRef = useRef<HTMLDivElement>(null);
	const titleId = useId();

	const isMounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false
	);

	useScrollLock(isOpen);
	useFocusTrap(drawerRef, isOpen);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isMounted || !isOpen) return null;

	const placementClasses = {
		bottom:
			'inset-x-0 bottom-0 rounded-none max-h-[85vh] border-x-0 border-b-0 border-t border-border-subtle animate-drawer-slide-in-bottom',
		right:
			'inset-y-0 right-0 w-full sm:max-w-md rounded-none h-full border-y-0 border-r-0 border-l border-border-subtle animate-drawer-slide-in-right',
		left:
			'inset-y-0 left-0 w-full sm:max-w-md rounded-none h-full border-y-0 border-l-0 border-r border-border-subtle animate-drawer-slide-in-left',
	};

	return createPortal(
		<div className='fixed inset-0 z-modal flex'>
			<div
				className='fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in'
				onClick={onClose}
				aria-hidden='true'
			/>
			<div
				ref={drawerRef}
				role='dialog'
				aria-modal='true'
				aria-labelledby={title ? titleId : undefined}
				tabIndex={-1}
				className={cn(
					'fixed z-10 bg-surface-card p-6 shadow-secondary flex flex-col gap-4 text-foreground outline-none overflow-y-auto',
					placementClasses[placement],
					className
				)}>
				{placement === 'bottom' && (
					<div className='w-12 h-1.5 bg-border-subtle rounded-full mx-auto mb-1 shrink-0' />
				)}
				<div className='flex items-center justify-between gap-4'>
					{title && (
						<h2
							id={titleId}
							className='text-lg font-title font-bold text-foreground'>
							{title}
						</h2>
					)}
					<button
						type='button'
						onClick={onClose}
						aria-label='Закрыть панель'
						className='shrink-0 ml-auto p-1 rounded-lg text-placeholder hover:text-foreground hover:bg-surface-tag transition-colors cursor-pointer'>
						<X className='size-5' />
					</button>
				</div>
				<div className='flex-1'>{children}</div>
			</div>
		</div>,
		document.body
	);
};
