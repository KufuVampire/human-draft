'use client';

import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { routesConfig } from '@/config';
import { useLogout, useResolvedHref } from '@/hooks';
import {
	Button,
	CustomLink,
	UserBadge,
} from '@/shared';
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownLinkItem,
	DropdownSeparator,
	DropdownTrigger,
} from '@/shared/ui';
import { useProfileStore } from '@/store';

export const UserProfile = () => {
	const t = useTranslations();
	const isAuth = useProfileStore((s) => s.isAuth);
	const profile = useProfileStore((s) => s.profile);
	const isLoading = useProfileStore((s) => s.isLoading);
	const resolveHref = useResolvedHref();
	const handleLogout = useLogout();

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
						<DropdownLinkItem
							href={resolveHref(routesConfig.profile)}
							icon={<User className='size-4' />}>
							{t('navigation.profile')}
						</DropdownLinkItem>
						<DropdownLinkItem
							href={resolveHref(routesConfig.settings)}
							icon={<Settings className='size-4' />}>
							{t('navigation.settingsShort')}
						</DropdownLinkItem>
						<DropdownSeparator />
						<DropdownItem
							variant='danger'
							icon={<LogOut className='size-4' />}
							onClick={handleLogout}>
							{t('navigation.logout')}
						</DropdownItem>
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
					className='hidden md:inline-flex rounded-xl py-2 px-5 font-medium text-sm text-on-fill max-w-50 w-auto shrink-0 whitespace-nowrap'>
					{t('btns.signIn')}
				</CustomLink>
			)}
		</>
	);
};
