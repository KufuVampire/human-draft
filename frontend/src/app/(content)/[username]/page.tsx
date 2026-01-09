import { redirect } from 'next/navigation';

import { routesConfig } from '@/config';
import { ProfilePage } from '@/screens';

interface Params {
	params: Promise<{ username: string }>;
}

export default async function Profile({ params }: Params) {
	const { username } = await params;

	if (!username) {
		redirect(routesConfig.notFound);
	}

	return <ProfilePage username={username} />;
}
