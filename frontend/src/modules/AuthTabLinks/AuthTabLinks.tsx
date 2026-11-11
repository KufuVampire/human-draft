'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { routesConfig } from '@/config';
import { cn } from '@/utils';

const tabLinkStyles =
	'w-full text-center cursor-pointer rounded-lg py-2 text-sm font-semibold transition-all z-10 text-muted hover:text-foreground';

export const AuthTabLinks = () => {
	const t = useTranslations('authTabLinks');
	const pathname = usePathname();

	const isSignInPath = pathname === routesConfig.signin;
	const isSignUpPath = pathname === routesConfig.signup;

	return (
		<div className='grid grid-cols-2 p-1 bg-surface-tag border border-border-subtle rounded-xl shadow-xs'>
			<Link
				href={routesConfig.signin}
				className={cn(tabLinkStyles, {
					'bg-surface-card text-foreground shadow-xs font-bold': isSignInPath,
				})}>
				{t('signIn')}
			</Link>
			<Link
				href={routesConfig.signup}
				className={cn(tabLinkStyles, {
					'bg-surface-card text-foreground shadow-xs font-bold': isSignUpPath,
				})}>
				{t('signUp')}
			</Link>
		</div>
	);
};
