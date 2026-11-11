'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef } from 'react';

import { useClickOutside } from '@/hooks';
import { Button, Modal } from '@/shared';
import { useModalData, useModalStore } from '@/store';
import { cn } from '@/utils';

interface Props {
	className?: string;
}

const buttonStyles = 'py-2.5 px-4 w-full tracking-wider uppercase text-xs font-semibold rounded-xl transition-all';

export const ConfirmationChangesModal = ({ className }: Props) => {
	const activeModal = useModalStore((s) => s.activeModal);
	const modalData = useModalData('confirmationChanges');
	const closeModal = useModalStore((s) => s.closeModal);
	const t = useTranslations();
	const modalRef = useRef<HTMLDivElement>(null);

	const isOpen = activeModal === 'confirmationChanges';

	const handleClose = useCallback(() => {
		closeModal();
	}, [closeModal]);

	useClickOutside(modalRef, handleClose);

	const handleConfirm = () => {
		modalData?.cb();
		closeModal();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}>
			<div
				ref={modalRef}
				className={cn(
					'bg-surface-card p-6 md:p-8 rounded-t-2xl sm:rounded-2xl border border-border-subtle shadow-xl w-full sm:max-w-md max-h-modal overflow-y-auto flex flex-col gap-y-6',
					className
				)}>
				<h2 className='font-title text-xl md:text-2xl font-bold text-foreground text-center'>
					{t('modals.saveChanges')}
				</h2>
				<div className='flex items-center gap-4'>
					<Button
						variant='secondary'
						className={cn(buttonStyles, 'border border-border-subtle hover:bg-surface-tag')}
						onClick={handleClose}>
						{t('btns.cancel')}
					</Button>
					<Button
						variant='primary'
						className={buttonStyles}
						onClick={handleConfirm}>
						{t('btns.save')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
