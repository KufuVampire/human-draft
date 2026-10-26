import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import {
	GetUserByUsernameDocument,
	GetUserByUsernameQuery,
} from '@/graphql/generated/output';
import { apolloClient } from '@/libs';
import { ProfilePage } from '@/screens';
import { isNotFoundError } from '@/utils';

interface Params {
	params: Promise<{ username: string }>;
}

const getUserByUsername = cache(async (username: string) => {
	try {
		const { data }: { data: GetUserByUsernameQuery } = await apolloClient.query({
			query: GetUserByUsernameDocument,
			variables: {
				username,
			},
		});

		return data?.getUserByUsername;
	} catch (err) {
		if (isNotFoundError(err)) {
			return null;
		}
		throw err;
	}
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { username } = await params;
	const user = await getUserByUsername(username);

	if (!user) {
		notFound();
	}

	return {
		title: user.username,
		openGraph: {
			type: 'profile',
			title: user.username,
			siteName: 'HUMAN DRAFT',
			username: user.username,
			url: `https://human-draft.com/${user.username}`,
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}

export default async function Profile({ params }: Params) {
	const { username } = await params;
	const user = await getUserByUsername(username);

	if (!user) {
		notFound();
	}

	return <ProfilePage username={username} initialData={user} />;
}
