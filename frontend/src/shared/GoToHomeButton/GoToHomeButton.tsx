import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { routesConfig } from '@/config';

export const GoToHomeButton = async () => {
	const t = await getTranslations('navigation');

	return (
		<Link
			href={routesConfig.home}
			className='flex items-center w-full cursor-pointer gap-x-2 hover:gap-x-3 transition-all'>
			<ArrowLeft />
			<span className='text-2xl'>{t('goToHome')}</span>
		</Link>
	);
};
