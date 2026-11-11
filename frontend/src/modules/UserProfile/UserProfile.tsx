'use client';

import { ChevronDown, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { routesConfig } from '@/config';
import { useResolvedHref } from '@/hooks';
import {
	Button,
	CustomLink,
	LogoutButton,
	UserBadge,
} from '@/shared';
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownTrigger,
} from '@/shared/ui';
import { useProfileStore } from '@/store';

export const UserProfile = () => {
	const t = useTranslations();
	const router = useRouter();
	const isAuth = useProfileStore((s) => s.isAuth);
	const profile = useProfileStore((s) => s.profile);
	const isLoading = useProfileStore((s) => s.isLoading);
	const resolveHref = useResolvedHref();

	return (
		<>
			{isAuth && (
				<Dropdown className='hidden md:inline-block'>
					<DropdownTrigger className='py-1 px-2 flex items-center justify-end gap-x-2 text-foreground hover:text-primary rounded-xl transition-colors'>
						<UserBadge
							username={profile?.username}
							avatarUrl={profile?.avatarUrl}
							location='header'
						/>
						<ChevronDown className='size-4 text-muted' />
					</DropdownTrigger>
					<DropdownContent align='end' className='w-48 p-1'>
						<DropdownItem
							icon={<User className='size-4' />}
							onClick={() => router.push(resolveHref(routesConfig.profile))}>
							{t('navigation.profile')}
						</DropdownItem>
						<DropdownItem
							icon={<Settings className='size-4' />}
							onClick={() => router.push(resolveHref(routesConfig.settings))}>
							{t('navigation.settingsShort')}
						</DropdownItem>
						<div className='my-1 border-t border-border-subtle' />
						<div className='px-1 py-0.5'>
							<LogoutButton className='text-sm w-full justify-start' />
						</div>
					</DropdownContent>
				</Dropdown>
			)}
			{isLoading && (
				<Button
					isLoading={isLoading}
					className='hidden md:inline-flex rounded-xl py-2 px-5 font-medium text-sm text-foreground shrink-0'
				/>
			)}
			{!isAuth && !isLoading && (
				<CustomLink
					variant='primary'
					href={routesConfig.signin}
					className='hidden md:inline-flex rounded-xl py-2 px-5 font-medium text-sm text-primary-foreground max-w-50 w-auto shrink-0 whitespace-nowrap'>
					{t('btns.signIn')}
				</CustomLink>
			)}
		</>
	);
};
