'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '../Button/Button';

import { useSignOutMutation } from '@/graphql/generated/output';
import { cn } from '@/utils';
import { useProfile } from '@/hooks';

interface Props {
	className?: string;
}

export const LogoutButton = ({ className }: Props) => {
	const t = useTranslations('navigation');
	const { logout } = useProfile();

	const [signOutMutation] = useSignOutMutation({
		onCompleted(data) {
			if (data.signOutAccount) {
				toast.success('Вы успешно вышли из аккаунта');
			}
		},
	});

	const handleClick = () => {
		signOutMutation();
		logout();
	};

	return (
		<Button
			variant='clear'
			onClick={handleClick}
			className={cn(
				'p-2 hover:bg-main-hover transition-colors w-full flex gap-x-1 justify-normal',
				className
			)}>
			<LogOut />
			{t('logout')}
		</Button>
	);
};
