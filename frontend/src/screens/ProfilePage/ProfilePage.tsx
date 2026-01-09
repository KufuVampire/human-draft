'use client';

import { redirect } from 'next/navigation';

import { routesConfig } from '@/config';
import { useGetUserByUsernameQuery } from '@/graphql/generated/output';
import { useProfile } from '@/store';

interface Props {
	username?: string;
}

export const ProfilePage = ({ username }: Props) => {
	const { profile } = useProfile();
	const { data, loading } = useGetUserByUsernameQuery({
		variables: {
			filters: {
				username: {
					eq: username,
				},
			},
		},
	});

	if (
		!loading &&
		(!data || !data.usersPermissionsUsers || !data.usersPermissionsUsers.length)
	) {
		redirect(routesConfig.notFound);
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<img src="./duck.webp" alt="poster" />
			<div>
				{username === profile?.username ? 'Your Profile' : username}
			</div>
		</div>
	);
};
