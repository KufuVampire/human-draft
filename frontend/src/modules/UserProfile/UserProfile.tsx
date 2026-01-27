'use client';

import { ChevronRight, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { routesConfig } from '@/config';
import { useActiveLink, useProfile } from '@/hooks';
import {
	Button,
	CustomLink,
	Dropdown,
	LogoutButton,
	UserBadge,
} from '@/shared';
import { cn } from '@/utils';

const items = [
	{
		href: routesConfig.profile,
		translationKey: 'navigation.profile',
		Icon: User,
	},
	{
		href: routesConfig.settings,
		translationKey: 'navigation.settingsShort',
		Icon: Settings,
	},
	{
		Component: LogoutButton,
	},
];

export const UserProfile = () => {
	const t = useTranslations();
	const [isOpen, setOpen] = useState(false);
	const { profile, isAuth, setSubscriptions, isLoading } = useProfile();
	const isActiveLink = useActiveLink();

	useEffect(() => {
		if (profile) {
			setSubscriptions(profile.subscriptions);
		}
	}, [profile, setSubscriptions]);

	const navigationItems = items.map(
		({ Component, Icon, href, translationKey }) => {
			if (Component) {
				return (
					<Component
						key={href}
						className='text-secondary'
					/>
				);
			}

			const settingsHref =
				href === routesConfig.settings && profile?.username
					? `/${profile?.username}/${routesConfig.settings}`
					: href;
			const profileHref =
				href === routesConfig.profile && profile?.username
					? `/${profile.username}`
					: href;
			const currentHref =
				href === routesConfig.profile ? profileHref : settingsHref;

			return (
				<CustomLink
					key={href}
					href={currentHref}
					className={cn(
						'p-2 hover:bg-main-hover text-secondary transition-colors w-full flex items-center justify-normal gap-x-1',
						isActiveLink(currentHref) && 'text-primary'
					)}>
					<Icon />
					{t(translationKey)}
				</CustomLink>
			);
		}
	);

	return (
		<>
			{isAuth && (
				<Dropdown
					isOpen={isOpen}
					setOpen={setOpen}
					items={navigationItems}
					className='py-0.5 px-2 hidden md:block'
					listClassName='bg-layout top-[calc(100%+2rem)]'
					displayDirection='top-right'>
					<Button
						variant='clear'
						onClick={() => setOpen((prev) => !prev)}
						className='w-full flex items-center justify-end gap-x-2 text-secondary'>
						<UserBadge
							username={profile?.username}
							avatarUrl={profile?.avatarUrl}
							location='header'
						/>
						<ChevronRight
							className={cn('size-5 transition-transform', {
								['rotate-90']: isOpen,
							})}
						/>
					</Button>
				</Dropdown>
			)}
			{isLoading && (
				<Button
					isLoading={isLoading}
					className='rounded-[0.625rem] py-3 px-[3.906rem] font-bold text-xl text-secondary max-w-50 w-full text-center leading-6 hidden md:block'
				/>
			)}
			{!isAuth && !isLoading && (
				<CustomLink
					variant='primary'
					href={routesConfig.signin}
					className='rounded-[0.625rem] py-3 px-[3.906rem] font-bold text-xl text-secondary max-w-50 w-full text-center leading-6 hidden md:block'>
					{t('btns.signIn')}
				</CustomLink>
			)}
		</>
	);
};
