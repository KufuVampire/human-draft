'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '../Button/Button';

import { useSignOutMutation } from '@/graphql/generated/output';
import { useProfileStore } from '@/store';
import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const LogoutButton = ({ className }: Props) => {
	const t = useTranslations('navigation');
	const logout = useProfileStore((s) => s.logout);

	const [signOutMutation] = useSignOutMutation({
		onCompleted() {
			toast.success('Вы успешно вышли из аккаунта');
		},
	});

	const handleClick = () => {
		logout();
		signOutMutation();
	};

	return (
		<Button
			variant='clear'
			onClick={handleClick}
			className={cn(
				'px-3 py-2 hover:bg-error/10 hover:text-error rounded-lg text-sm transition-colors w-full flex items-center justify-start text-left gap-x-2.5 text-foreground h-9',
				className
			)}>
			<LogOut className='size-4 shrink-0' />
			<span>{t('logout')}</span>
		</Button>
	);
};
