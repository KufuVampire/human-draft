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
							'px-3 py-2 hover:bg-surface-tag text-foreground text-sm rounded-lg transition-colors w-full flex items-center justify-normal gap-x-2',
							isActiveLink(currentHref) && 'text-primary font-medium bg-primary/10'
						)}>
						<Icon className='size-4' />
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
					listClassName='bg-surface-card border border-border-subtle shadow-lg py-1'
					displayDirection='top-right'>
					<Button
						variant='clear'
						onClick={() => setOpen((prev) => !prev)}
						className='w-full flex items-center justify-end gap-x-2 text-foreground hover:text-primary transition-colors'>
						<UserBadge
							username={profile?.username}
							avatarUrl={profile?.avatarUrl}
							location='header'
						/>
						<ChevronRight
							className={cn('size-4 transition-transform text-muted', {
								['rotate-90']: isOpen,
							})}
						/>
					</Button>
				</Dropdown>
			)}
			{isLoading && (
				<Button
					isLoading={isLoading}
					className='rounded-xl py-2 px-5 font-medium text-sm text-foreground shrink-0'
				/>
			)}
			{!isAuth && !isLoading && (
				<CustomLink
					variant='primary'
					href={routesConfig.signin}
					className='rounded-xl py-2 px-5 font-medium text-sm text-primary-foreground max-w-50 w-auto shrink-0 whitespace-nowrap'>
					{t('btns.signIn')}
				</CustomLink>
			)}
		</>
	);
};
