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

const buttonStyles = 'p-2 md:p-3 w-full tracking-wider uppercase rounded-lg';

export const ConfirmationDeletionModal = ({ className }: Props) => {
	const activeModal = useModalStore((s) => s.activeModal);
	const modalData = useModalData('confirmationDeletion');
	const closeModal = useModalStore((s) => s.closeModal);
	const t = useTranslations();
	const modalRef = useRef<HTMLDivElement>(null);

	const isOpen = activeModal === 'confirmationDeletion';

	const handleClose = useCallback(() => {
		closeModal();
	}, [closeModal]);

	useClickOutside(modalRef, handleClose);

	const type = modalData?.type ?? 'post';

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
					'bg-surface-card px-4 md:px-5 py-5 md:py-6 rounded-t-2xl sm:rounded-xl w-full sm:w-auto max-h-[90vh] overflow-y-auto flex flex-col gap-y-7.5 md:gap-y-12',
					className
				)}>
				<h2 className='font-title text-[1.75rem] md:text-4xl font-bold leading-heading-tight text-center'>
					{t(`modals.remove${type.charAt(0).toUpperCase() + type.slice(1)}`)}
				</h2>
				<div className='flex justify-between gap-x-12'>
					<Button
						variant='secondary'
						className={cn(buttonStyles, 'dark:text-secondary')}
						onClick={handleClose}>
						{t('btns.cancel')}
					</Button>
					<Button
						className={buttonStyles}
						onClick={handleConfirm}>
						{t('btns.remove')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
