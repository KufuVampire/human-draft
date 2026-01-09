'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

import { routesConfig } from '@/config';
import { useLocalStorage, useResizeObserver } from '@/hooks';
import { cn } from '@/utils';

const tabLinkStyles =
	'w-full text-center cursor-pointer rounded-md py-1.5 hover:bg-primary-hover hover:text-secondary transition-colors z-10';

export const AuthTabLinks = () => {
	const [theme] = useLocalStorage('theme', 'light');
	const t = useTranslations('authTabLinks');
	const pathname = usePathname();

	const [leftRef, leftRect] = useResizeObserver<HTMLAnchorElement>();
	const [rightRef, rightRect] = useResizeObserver<HTMLAnchorElement>();

	const leftSize = (leftRect.width + leftRect.x * 2) / 16 + 'rem';
	const rightSize = (rightRect.width + rightRect.x * 2) / 16 + 'rem';

	const isSignInPath = pathname === routesConfig.signin;
	const isSignUpPath = pathname === routesConfig.signup;

	const isCalculateWidthFinished = leftRect.width > 0 && rightRect.width > 0;

	useLayoutEffect(() => {
		const isDark = theme === 'dark';

		document.body.classList.toggle('dark', isDark);
	}, [theme]);

	return (
		<div className='flex items-center relative border-2 border-primary rounded-xl'>
			<Link
				ref={leftRef}
				href={routesConfig.signin}
				className={cn(tabLinkStyles, 'rounded-tr-none rounded-br-none', {
					['bg-primary text-secondary']: isSignInPath,
				})}>
				{t('signIn')}
			</Link>
			<Link
				ref={rightRef}
				href={routesConfig.signup}
				className={cn(tabLinkStyles, 'rounded-tl-none rounded-bl-none', {
					['bg-primary text-secondary']: isSignUpPath,
				})}>
				{t('signUp')}
			</Link>
			<div className='absolute flex w-full h-full z-0'>
				{isCalculateWidthFinished && (
					<div
						style={{
							width: isSignUpPath ? rightSize : leftSize,
							marginLeft: isSignUpPath ? leftSize : 0,
						}}
						className='bg-primary transition-all rounded-md'
					/>
				)}
			</div>
		</div>
	);
};
