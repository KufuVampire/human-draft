'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '../Button/Button';

import { useProfile } from '@/store';
import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const LogoutButton = ({ className }: Props) => {
	const t = useTranslations('navigation');
	const { logout } = useProfile();

	return (
		<Button
			variant='clear'
			onClick={() => logout()}
			className={cn('p-2 hover:bg-main-hover transition-colors w-full flex gap-x-1 justify-normal', className)}>
			<LogOut />
			{t('logout')}
		</Button>
	);
};
