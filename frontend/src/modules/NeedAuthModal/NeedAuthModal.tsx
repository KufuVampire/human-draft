'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef } from 'react';

import { routesConfig } from '@/config';
import { useClickOutside } from '@/hooks';
import { Button, CustomLink, Modal } from '@/shared';
import { useModalStore } from '@/store';
import { cn } from '@/utils';

const buttonStyles = 'py-2.5 px-4 w-full tracking-wider uppercase text-xs font-semibold rounded-xl text-center transition-all';

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
				className='bg-surface-card p-6 md:p-8 rounded-t-2xl sm:rounded-2xl border border-border-subtle shadow-xl w-full sm:max-w-md max-h-modal overflow-y-auto flex flex-col gap-y-6'>
				<h2 className='font-title text-xl md:text-2xl font-bold text-foreground text-center'>
					{t('modals.needAuth')}
				</h2>
				<div className='flex items-center gap-4'>
					<Button
						variant='secondary'
						className={cn(buttonStyles, 'border border-border-subtle hover:bg-surface-tag')}
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
