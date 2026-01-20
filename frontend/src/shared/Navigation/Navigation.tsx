'use client';

import { Newspaper, User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CustomLink } from '../CustomLink/CustomLink';

import { routesConfig } from '@/config';
import { UNAVAILABLE_ROUTES_IF_NOT_AUTH } from '@/consts';
import { useActiveLink, useProfile } from '@/hooks';
import { cn } from '@/utils';

type NavigationVariants = 'dashboard' | 'footer';

interface Props {
	className?: string;
	direction?: 'row' | 'column';
	variant?: NavigationVariants;
	isExpanded?: boolean;
}

const listItem = [
	{
		href: routesConfig.profile,
		translationKey: 'profile',
		Icon: User,
	},
	{
		href: routesConfig.home,
		translationKey: 'feed',
		Icon: Newspaper,
	},
	{
		href: routesConfig.users,
		translationKey: 'users',
		Icon: Users,
	},
];

const styles: Record<NavigationVariants, string> = {
	dashboard: 'text-[var(--text-color-main)] leading-[1.375rem] gap-x-1 px-2.5',
	footer:
		'text-secondary font-bold uppercase tracking-widest md:leading-6 leading-[1.125rem] text-xs',
};

export const Navigation = ({
	className,
	direction = 'column',
	variant = 'dashboard',
	isExpanded = true,
}: Props) => {
	const t = useTranslations('navigation');
	const { isAuth, profile } = useProfile();
	const isActiveLink = useActiveLink();

	return (
		<nav className={className}>
			<ul
				className={cn(
					'flex gap-y-5',
					direction === 'column' ? 'flex-col' : 'flex-row',
					variant === 'footer' && 'gap-x-5 justify-between md:justify-normal'
				)}>
				{listItem.map(({ href, translationKey, Icon }) => {
					if (UNAVAILABLE_ROUTES_IF_NOT_AUTH.includes(href) && !isAuth) {
						return null;
					}

					const currentHref =
						href === routesConfig.profile && profile?.username
							? `/${profile?.username}`
							: href;

					return (
						<li key={href}>
							<CustomLink
								href={currentHref}
								className={cn(
									'justify-normal w-full md:text-xl',
									styles[variant],
									isActiveLink(currentHref) && 'text-primary'
								)}>
								{variant === 'dashboard' && <Icon className='size-6' />}
								<span className={cn(!isExpanded && 'hidden')}>
									{t(translationKey)}
								</span>
							</CustomLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
