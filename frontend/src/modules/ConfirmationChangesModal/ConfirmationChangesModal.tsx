'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { useClickOutside } from '@/hooks';
import { Button, Modal } from '@/shared';
import { useConfirmationChangesModal } from '@/store';
import { cn } from '@/utils';

interface Props {
	className?: string;
}

const buttonStyles = 'py-3 w-full tracking-[5%] uppercase rounded-lg';

export const ConfirmationChangesModal = ({ className }: Props) => {
	const { isOpen, setOpen, cb } = useConfirmationChangesModal();
	const t = useTranslations();
	const modalRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setOpen(false);
	};

	useClickOutside(modalRef, handleClose);

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen}>
			<div
				ref={modalRef}
				className={cn(
					'bg-[var(--background-color-card)] px-5 py-6 rounded-lg flex flex-col gap-y-12',
					className
				)}>
				<h2 className='font-title text-4xl font-bold leading-[110%]'>
					{t('modals.saveChanges')}
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
						onClick={cb}>
						{t('btns.save')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
