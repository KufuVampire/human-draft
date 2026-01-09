'use client';

import { Newspaper, Settings, User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { Burger } from './Burger/Burger';
import { routesConfig } from '@/config';
import { useClickOutside } from '@/hooks';
import { CustomLink, Dropdown, LanguageSwitcher, LogoutButton } from '@/shared';
import { useProfile } from '@/store';

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
		translationKey: 'navigation.settings',
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
	const { isAuth } = useProfile();
	const isMobile = useMediaQuery({ maxWidth: 768 });

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
		return burgerDropdownItems
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

				return (
					<CustomLink
						key={href}
						href={href}
						className='p-2 hover:bg-main-hover w-full flex gap-x-1 justify-normal text-secondary'>
						<Icon />
						{t(translationKey)}
					</CustomLink>
				);
			})
			.filter(Boolean);
	}, [isAuth, t]);

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
