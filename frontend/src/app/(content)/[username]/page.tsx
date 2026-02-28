import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { routesConfig } from '@/config';
import { AuthGuard } from '@/guards';
import { ProfilePage } from '@/screens';

interface Params {
	params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { username } = await params;

	return {
		title: username,
	};
}

export default async function Profile({ params }: Params) {
	const { username } = await params;

	if (!username) {
		redirect(routesConfig.notFound);
	}

	return (
		<AuthGuard>
			<ProfilePage username={username} />
		</AuthGuard>
	);
}
