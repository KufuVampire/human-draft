'use client';

import { Newspaper, Settings, User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { Burger } from './Burger/Burger';
import { routesConfig } from '@/config';
import { useActiveLink, useClickOutside, useProfile } from '@/hooks';
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
	const isMobile = useMediaQuery({ maxWidth: 768 });
	const isActiveLink = useActiveLink();

	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setOpen(false);
	};

	useClickOutside(dropdownRef, handleClose);

	useEffect(() => {
		if (!isMobile) {
			handleClose();
		}
	}, [isMobile]);
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
							className='p-2 text-secondary'
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
							'p-2 hover:bg-main-hover w-full flex gap-x-1 justify-normal text-secondary',
							isActiveLink(currentHref) && 'text-primary'
						)}>
						<Icon />
						{t(translationKey)}
					</CustomLink>
				);
			})
			.filter(Boolean);

		return [
			<div key='user-profile' className='flex gap-x-1 p-2 w-full items-center'>
				<UserBadge
					username={profile?.username}
					avatarUrl={profile?.avatarUrl}
					location='burger-menu'
					className='size-6'
				/>
			</div>,
			...items,
		];
	}, [isActiveLink, isAuth, profile, t]);

	return (
		<Dropdown
			displayDirection='top-right'
			className={className}
			listClassName='top-[calc(100%+1.875rem)] bg-layout'
			ref={dropdownRef}
			isOpen={isOpen}
			items={dropdownItems}>
			<Burger
				isOpen={isOpen}
				setOpen={setOpen}
			/>
		</Dropdown>
	);
};
