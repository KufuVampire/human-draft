'use client';

import { Newspaper, Settings, User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Burger } from './Burger/Burger';
import { routesConfig } from '@/config';
import { useActiveLink, useProfile, useResolvedHref } from '@/hooks';
import {
	CustomLink,
	Dropdown,
	LanguageSwitcher,
	LogoutButton,
	UserBadge,
} from '@/shared';
import { cn } from '@/utils';

interface Props {
	className?: string;
}

const burgerDropdownItems = [
	{
		needAuth: false,
		href: routesConfig.home,
		translationKey: 'navigation.feed',
		Icon: Newspaper,
	},
	{
		needAuth: true,
		href: routesConfig.profile,
		translationKey: 'navigation.profile',
		Icon: User,
	},
	{
		needAuth: false,
		href: routesConfig.users,
		translationKey: 'navigation.users',
		Icon: Users,
	},
	{
		needAuth: true,
		href: routesConfig.settings,
		translationKey: 'navigation.settingsShort',
		Icon: Settings,
	},
	{
		needAuth: true,
		Component: LogoutButton,
	},
	{
		needAuth: false,
		Component: LanguageSwitcher,
	},
];

export const BurgerMenu = ({ className }: Props) => {
	const t = useTranslations();
	const [isOpen, setOpen] = useState(false);
	const { isAuth, profile } = useProfile();
	const isActiveLink = useActiveLink();
	const resolveHref = useResolvedHref();

	const dropdownItems = useMemo(() => {
		const items = burgerDropdownItems
			.map(({ Icon, href, translationKey, Component, needAuth }, i) => {
				if (needAuth && !isAuth) {
					return null;
				}

				if (Component) {
					return (
						<Component
							key={i}
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
							'p-2 hover:bg-main-hover w-full flex gap-x-1 justify-normal text-secondary',
							isActiveLink(currentHref) && 'text-primary'
						)}>
						<Icon />
						{t(translationKey)}
					</CustomLink>
				);
			})
			.filter(Boolean);

		if (profile) {
			return [
				<div
					key='user-profile'
					className='flex gap-x-1 p-2 w-full items-center'>
					<UserBadge
						username={profile?.username}
						avatarUrl={profile.avatarUrl}
						location='burger-menu'
						className='size-6'
					/>
				</div>,
				...items,
			];
		}

		return items;
	}, [isActiveLink, isAuth, profile, resolveHref, t]);

	return (
		<Dropdown
			displayDirection='top-right'
			className={className}
			listClassName='top-[calc(100%+1.875rem)] bg-layout'
			isOpen={isOpen}
			setOpen={setOpen}
			items={dropdownItems}>
			<Burger
				isOpen={isOpen}
				setOpen={setOpen}
			/>
		</Dropdown>
	);
};
