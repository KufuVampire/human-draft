'use client';

import { useTranslations } from 'next-intl';

import { routesConfig } from '@/config';
import Link from 'next/link';

export const Logo = () => {
	const t = useTranslations('header');

	return (
		<Link
			href={routesConfig.home}
			className='font-text font-bold text-secondary text-xl md:text-[2rem] min-w-max uppercase'>
			{t('logo')}
		</Link>
	);
};
