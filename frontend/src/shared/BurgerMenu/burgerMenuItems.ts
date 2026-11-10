import {
	LogIn,
	Newspaper,
	Settings,
	User,
	UserPlus,
	Users,
} from 'lucide-react';
import type { ComponentType } from 'react';

import { routesConfig } from '@/config';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { LogoutButton } from '../LogoutButton/LogoutButton';

export interface BurgerDropdownItem {
	needAuth?: boolean;
	onlyGuest?: boolean;
	href?: string;
	translationKey?: string;
	Icon?: ComponentType<{ className?: string }>;
	Component?: ComponentType<{ className?: string }>;
}

export const burgerDropdownItems: BurgerDropdownItem[] = [
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
