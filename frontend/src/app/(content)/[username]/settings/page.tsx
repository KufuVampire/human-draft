import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AuthGuard } from '@/guards';
import { SettingsPage } from '@/screens';

interface Params {
	params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const t = await getTranslations('settingsPage.metadata');

	const { username } = await params;

	return {
		title: `${username} | ${t('title')}`,
		description: t('description'),
	};
}

export default function ProfileSettings() {
	return (
		<AuthGuard>
			<SettingsPage />
		</AuthGuard>
	);
}
