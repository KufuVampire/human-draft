import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { HomePage } from '@/screens';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('homePage.metadata');

	return {
		title: t('title'),
		description: t('description'),
	};
}

export default function Home() {
	return <HomePage />;
}
