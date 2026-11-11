'use client';

import { useTranslations } from 'next-intl';

import { routesConfig } from '@/config';
import Link from 'next/link';

export const Logo = () => {
	const t = useTranslations('header');

	return (
		<Link
			href={routesConfig.home}
			className='font-title font-bold text-foreground hover:text-primary text-xl md:text-2xl min-w-max uppercase tracking-tight transition-colors'>
			{t('logo')}
		</Link>
	);
};
