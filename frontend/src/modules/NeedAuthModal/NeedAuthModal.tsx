'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef } from 'react';

import { routesConfig } from '@/config';
import { useClickOutside } from '@/hooks';
import { Button, CustomLink, Modal } from '@/shared';
import { useModalStore } from '@/store';
import { cn } from '@/utils';

const buttonStyles = 'py-3 w-full tracking-wider uppercase rounded-lg';

export const NeedAuthModal = () => {
	const t = useTranslations();
	const modalRef = useRef<HTMLDivElement>(null);
	const activeModal = useModalStore((s) => s.activeModal);
	const closeModal = useModalStore((s) => s.closeModal);

	const isOpen = activeModal === 'needAuth';

	const handleClose = useCallback(() => {
		closeModal();
	}, [closeModal]);

	useClickOutside(modalRef, handleClose);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}>
			<div
				ref={modalRef}
				className='bg-surface-card px-4 md:px-5 py-5 md:py-6 rounded-t-2xl sm:rounded-xl w-full sm:w-auto max-h-[90vh] overflow-y-auto flex flex-col gap-y-7.5 md:gap-y-12'>
				<h2 className='font-title text-[1.75rem] md:text-4xl font-bold leading-heading-tight'>
					{t('modals.needAuth')}
				</h2>
				<div className='flex justify-between gap-x-12'>
					<Button
						variant='secondary'
						className={cn(buttonStyles, 'dark:text-secondary')}
						onClick={handleClose}>
						{t('btns.cancel')}
					</Button>
					<CustomLink
						variant='primary'
						href={routesConfig.signin}
						className={buttonStyles}
						onClick={handleClose}>
						{t('btns.signIn')}
					</CustomLink>
				</div>
			</div>
		</Modal>
	);
};
