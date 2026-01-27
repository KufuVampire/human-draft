'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { useClickOutside } from '@/hooks';
import { Button, Modal } from '@/shared';
import { useConfirmationDeletionModal } from '@/store';
import { cn } from '@/utils';

interface Props {
	className?: string;
}

const buttonStyles = 'py-3 w-full tracking-[5%] uppercase rounded-lg';

export const ConfirmationDeletionModal = ({ className }: Props) => {
	const { isOpen, setOpen, cb, type } = useConfirmationDeletionModal();
	const t = useTranslations();
	const modalRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setOpen(false);
	};

	useClickOutside(modalRef, handleClose);

	return (
		<Modal isOpen={isOpen}>
			<div
				ref={modalRef}
				className={cn(
					'bg-[var(--background-color-card)] px-3 md:px-5 py-6 rounded-lg flex flex-col gap-y-[1.875rem] md:gap-y-12',
					className
				)}>
				<h2 className='font-title text-[1.75rem] md:text-4xl font-bold leading-[110%]'>
					{type === 'post' && t('modals.removePost')}
					{type === 'blog' && t('modals.removeBlog')}
					{type === 'poster' && t('modals.removePoster')}
					{type === 'avatar' && t('modals.removeAvatar')}
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
						{t('btns.remove')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
