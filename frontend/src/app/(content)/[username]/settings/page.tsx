import { SettingsPage } from '@/screens';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('settingsPage.metadata');

	return {
		title: t('title'),
		description: t('description'),
	};
}

export default function ProfileSettings() {
	return <SettingsPage />;
}
