'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { routesConfig } from '@/config';
import { useClickOutside } from '@/hooks';
import { Button, CustomLink, Modal } from '@/shared';
import { useNeedAuthModal } from '@/store';
import { cn } from '@/utils';

const buttonStyles = 'py-3 w-full tracking-[5%] uppercase rounded-lg';

export const NeedAuthModal = () => {
	const t = useTranslations();
	const modalRef = useRef<HTMLDivElement>(null);
	const { isOpen, setOpen } = useNeedAuthModal();

	const handleClose = () => {
		setOpen(false);
	};

	useClickOutside(modalRef, handleClose);

	useEffect(() => {
		handleClose();
	}, []);

	return (
		<Modal isOpen={isOpen}>
			<div
				ref={modalRef}
				className='bg-[var(--background-color-card)] px-3 md:px-5 py-6 rounded-lg flex flex-col gap-y-[1.875rem] md:gap-y-12'>
				<h2 className='font-title text-[1.75rem] md:text-4xl font-bold leading-[110%]'>
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
						className={buttonStyles}>
						{t('btns.signIn')}
					</CustomLink>
				</div>
			</div>
		</Modal>
	);
};
