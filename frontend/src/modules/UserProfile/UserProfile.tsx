'use client';

import { ChevronRight, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { routesConfig } from '@/config';
import { useActiveLink, useResolvedHref } from '@/hooks';
import {
	Button,
	CustomLink,
	Dropdown,
	LogoutButton,
	UserBadge,
} from '@/shared';
import { useProfileStore } from '@/store';
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
	const isAuth = useProfileStore((s) => s.isAuth);
	const profile = useProfileStore((s) => s.profile);
	const isLoading = useProfileStore((s) => s.isLoading);
	const isActiveLink = useActiveLink();
	const resolveHref = useResolvedHref();

	const navigationItems = useMemo(
		() =>
			items.map(({ Component, Icon, href, translationKey }) => {
				if (Component) {
					return (
						<Component
							key={href}
							className='text-secondary'
						/>
					);
				}

				const currentHref = resolveHref(href);

				return (
					<CustomLink
						key={href}
						href={currentHref}
						className={cn(
							'p-2 hover:bg-main-hover text-secondary transition-colors w-full flex items-center justify-normal gap-x-1',
							isActiveLink(currentHref) && 'text-accent'
						)}>
						<Icon />
						{t(translationKey)}
					</CustomLink>
				);
			}),
		[isActiveLink, resolveHref, t]
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
					className='rounded-card py-1.5 md:py-3 px-3 md:px-16 font-bold text-sm md:text-xl text-secondary max-w-50 w-auto md:w-full text-center leading-6 shrink-0'
				/>
			)}
			{!isAuth && !isLoading && (
				<CustomLink
					variant='primary'
					href={routesConfig.signin}
					className='rounded-card py-1.5 md:py-3 px-3 md:px-16 font-bold text-sm md:text-xl text-secondary max-w-50 w-auto md:w-full text-center leading-6 shrink-0 whitespace-nowrap'>
					{t('btns.signIn')}
				</CustomLink>
			)}
		</>
	);
};
