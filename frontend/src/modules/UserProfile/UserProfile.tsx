'use client';

import { ChevronRight, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useRef, useState } from 'react';



import { routesConfig } from '@/config';
import { useClickOutside } from '@/hooks';
import { TypeUserProfile } from '@/schemas';
import { Button, CustomLink, Dropdown, LogoutButton } from '@/shared';
import { useProfile } from '@/store';
import { cn } from '@/utils';





const items = [
	{
		href: routesConfig.profile,
		translationKey: 'navigation.profile',
		Icon: User,
	},
	{
		href: routesConfig.settings,
		translationKey: 'navigation.settings',
		Icon: Settings,
	},
	{
		Component: LogoutButton,
	},
];

interface Props {
	userProfile: TypeUserProfile | null;
}

export const UserProfile = ({ userProfile }: Props) => {
	const t = useTranslations();
	const profileRef = useRef<HTMLDivElement>(null);
	const [isOpen, setOpen] = useState(false);
	const { profile, isLoading, isAuth, setProfile } = useProfile();

	useLayoutEffect(() => {
		if (userProfile) {
			setProfile(userProfile);
		}
	}, [userProfile, setProfile]);

	useClickOutside(profileRef, () => setOpen(false));

	const navigationItems = items.map(
		({ Component, Icon, href, translationKey }) =>
			Component ? (
				<Component
					key={href}
					className='text-secondary'
				/>
			) : (
				<CustomLink
					key={href}
					href={href}
					className='p-2 hover:bg-main-hover text-secondary transition-colors w-full flex items-center justify-normal gap-x-1'>
					<Icon />
					{t(translationKey)}
				</CustomLink>
			)
	);

	return (
		<>
			{isAuth && (
				<Dropdown
					isOpen={isOpen}
					items={navigationItems}
					className='w-full max-w-28 py-0.5 px-2 hidden md:block'
					listClassName='bg-layout top-[calc(100%+2.5rem)]'
					displayDirection='top-right'
					ref={profileRef}>
					<Button
						variant='clear'
						onClick={() => setOpen((prev) => !prev)}
						className='w-full flex items-center justify-end gap-x-3 text-secondary'>
						<span className='text-lg'>{profile?.username}</span>
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
					isLoading={isLoading}
					className='rounded-[0.625rem] py-4 px-[3.906rem] font-bold text-xl text-secondary max-w-[12.5rem] w-full text-center leading-6 hidden md:block min-w-[12.5rem]'>
					{t('btns.signIn')}
				</CustomLink>
			)}
		</>
	);
};