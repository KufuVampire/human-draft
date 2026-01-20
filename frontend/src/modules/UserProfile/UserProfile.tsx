'use client';

import { ChevronRight, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useRef, useState } from 'react';

import { routesConfig } from '@/config';
import { UserModel } from '@/graphql/generated/output';
import { useActiveLink, useClickOutside, useProfile } from '@/hooks';
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

interface Props {
	userProfile: UserModel | null;
}

export const UserProfile = ({ userProfile }: Props) => {
	const t = useTranslations();
	const profileRef = useRef<HTMLDivElement>(null);
	const [isOpen, setOpen] = useState(false);
	const { profile, isAuth, setProfile, setSubscriptions, setLoading } =
		useProfile();
	const isActiveLink = useActiveLink();

	useLayoutEffect(() => {
		if (userProfile && !profile) {
			setProfile(userProfile);
			setSubscriptions(userProfile.subscriptions);
			setLoading(false);
		}
	}, [profile, setLoading, setProfile, setSubscriptions, userProfile]);

	useClickOutside(profileRef, () => setOpen(false));

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
					className={cn('p-2 hover:bg-main-hover text-secondary transition-colors w-full flex items-center justify-normal gap-x-1', isActiveLink(currentHref) && 'text-primary')}>
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
					items={navigationItems}
					className='py-0.5 px-2 hidden md:block'
					listClassName='bg-layout top-[calc(100%+2rem)]'
					displayDirection='top-right'
					ref={profileRef}>
					<Button
						variant='clear'
						onClick={() => setOpen((prev) => !prev)}
						className='w-full flex items-center justify-end gap-x-2 text-secondary'>
						{userProfile && (
							<UserBadge
								username={userProfile?.username}
								avatarUrl={userProfile?.avatarUrl}
								location='header'
							/>
						)}
						<ChevronRight
							className={cn('size-5 transition-transform', {
								['rotate-90']: isOpen,
							})}
						/>
					</Button>
				</Dropdown>
			)}
			{!isAuth && (
				<CustomLink
					variant='primary'
					href={routesConfig.signin}
					className='rounded-[0.625rem] py-4 px-[3.906rem] font-bold text-xl text-secondary max-w-[12.5rem] w-full text-center leading-6 hidden md:block min-w-[12.5rem]'>
					{t('btns.signIn')}
				</CustomLink>
			)}
		</>
	);
};
