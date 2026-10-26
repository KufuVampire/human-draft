import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ContentLayout from './(content)/layout';
import ContentNotFound from './(content)/not-found';
import { NO_INDEX_PAGE } from '@/consts';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('404.metadata');

	return {
		title: t('title'),
		...NO_INDEX_PAGE,
	};
}

export default async function NotFound() {
	return (
		<ContentLayout>
			{await ContentNotFound()}
		</ContentLayout>
	);
}
