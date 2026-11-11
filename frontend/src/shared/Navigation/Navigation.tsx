'use client';

import { Newspaper, User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CustomLink } from '../CustomLink/CustomLink';

import { routesConfig } from '@/config';
import { UNAVAILABLE_ROUTES_IF_NOT_AUTH } from '@/consts';
import { useActiveLink, useResolvedHref } from '@/hooks';
import { useProfileStore } from '@/store';
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
	dashboard: 'text-foreground leading-normal gap-x-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-surface-tag',
	footer:
		'text-muted font-semibold uppercase tracking-wider text-xs hover:text-primary transition-colors',
};

export const Navigation = ({
	className,
	direction = 'column',
	variant = 'dashboard',
	isExpanded = true,
}: Props) => {
	const t = useTranslations('navigation');
	const isAuth = useProfileStore((s) => s.isAuth);
	const isActiveLink = useActiveLink();
	const resolveHref = useResolvedHref();

	return (
		<nav className={className}>
			<ul
				className={cn(
					'flex',
					direction === 'column' ? 'flex-col gap-1' : 'flex-row',
					variant === 'footer' && 'gap-x-6 justify-between md:justify-normal'
				)}>
				{listItem.map(({ href, translationKey, Icon }) => {
					if (UNAVAILABLE_ROUTES_IF_NOT_AUTH.includes(href) && !isAuth) {
						return null;
					}

					const currentHref = resolveHref(href);

					return (
						<li key={href}>
							<CustomLink
								href={currentHref}
								className={cn(
									'justify-normal w-full text-sm md:text-base font-medium',
									!isExpanded && 'justify-center px-2',
									styles[variant],
									variant === 'dashboard' &&
										isActiveLink(currentHref) &&
										'text-primary font-semibold bg-primary/10 hover:bg-primary/15'
								)}>
								{variant === 'dashboard' && <Icon className='size-5 shrink-0' />}
								<span
									className={cn(
										'whitespace-nowrap overflow-hidden transition-all duration-300',
										!isExpanded ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-40 opacity-100'
									)}>
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
