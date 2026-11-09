'use client';

import {
	LogIn,
	Newspaper,
	Settings,
	User,
	UserPlus,
	Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ComponentType, useMemo, useState } from 'react';

import { Burger } from './Burger/Burger';
import { routesConfig } from '@/config';
import { useActiveLink, useResolvedHref } from '@/hooks';
import {
	CustomLink,
	Dropdown,
	LanguageSwitcher,
	LogoutButton,
	UserBadge,
} from '@/shared';
import { useProfileStore } from '@/store';
import { cn } from '@/utils';

interface Props {
	className?: string;
}

interface BurgerDropdownItem {
	needAuth?: boolean;
	onlyGuest?: boolean;
	href?: string;
	translationKey?: string;
	Icon?: ComponentType<{ className?: string }>;
	Component?: ComponentType<{ className?: string }>;
}

const burgerDropdownItems: BurgerDropdownItem[] = [
	{
		needAuth: false,
		href: routesConfig.home,
		translationKey: 'navigation.feed',
		Icon: Newspaper,
	},
	{
		onlyGuest: true,
		href: routesConfig.signin,
		translationKey: 'btns.signIn',
		Icon: LogIn,
	},
	{
		onlyGuest: true,
		href: routesConfig.signup,
		translationKey: 'btns.signUp',
		Icon: UserPlus,
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
	const isAuth = useProfileStore((s) => s.isAuth);
	const profile = useProfileStore((s) => s.profile);
	const isActiveLink = useActiveLink();
	const resolveHref = useResolvedHref();

	const dropdownItems = useMemo(() => {
		const items = burgerDropdownItems
			.map(
				(
					{ Icon, href, translationKey, Component, needAuth, onlyGuest },
					i
				) => {
					if (needAuth && !isAuth) {
						return null;
					}

					if (onlyGuest && isAuth) {
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

					if (!href || !Icon || !translationKey) {
						return null;
					}

					const currentHref = resolveHref(href);

					return (
						<CustomLink
							key={href}
							href={currentHref}
							onClick={() => setOpen(false)}
							className={cn(
								'p-2 hover:bg-main-hover w-full flex gap-x-1 justify-normal text-secondary',
								isActiveLink(currentHref) && 'text-primary'
							)}>
							<Icon />
							{t(translationKey)}
						</CustomLink>
					);
				}
			)
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
