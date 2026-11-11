'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Burger } from './Burger/Burger';
import { burgerDropdownItems } from './burgerMenuItems';
import { useActiveLink, useResolvedHref } from '@/hooks';
import { CustomLink } from '../CustomLink/CustomLink';
import { UserBadge } from '../UserBadge/UserBadge';
import { Drawer } from '@/shared/ui';
import { useProfileStore } from '@/store';
import { cn } from '@/utils';

interface Props {
	className?: string;
}

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
								'px-3 py-2 hover:bg-surface-tag rounded-lg text-sm transition-colors w-full flex items-center justify-start text-left gap-x-2.5 text-foreground',
								isActiveLink(currentHref) && 'text-primary font-medium bg-primary/10'
							)}>
							<Icon className='size-4 shrink-0' />
							<span>{t(translationKey)}</span>
						</CustomLink>
					);
				}
			)
			.filter(Boolean);

		if (profile) {
			return [
				<div
					key='user-profile'
					className='flex gap-x-2 px-3 py-2 w-full items-center border-b border-border-subtle mb-1'>
					<UserBadge
						username={profile?.username}
						avatarUrl={profile.avatarUrl}
						location='burger-menu'
						className='size-7'
					/>
				</div>,
				...items,
			];
		}

		return items;
	}, [isActiveLink, isAuth, profile, resolveHref, t]);

	return (
		<div className={className}>
			<Burger
				isOpen={isOpen}
				setOpen={setOpen}
			/>
			<Drawer
				isOpen={isOpen}
				onClose={() => setOpen(false)}
				placement='right'
				title={profile?.username ? `@${profile.username}` : t('navigation.menu')}
				className='w-72 sm:w-80 p-5'>
				<nav className='flex flex-col gap-1.5 mt-2'>
					{dropdownItems}
				</nav>
			</Drawer>
		</div>
	);
};
