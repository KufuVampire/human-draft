'use client';

import { useEffect } from 'react';

import { UserModel } from '@/graphql/generated/output';
import { useProfile } from '@/hooks';

interface Props {
	user: UserModel | null;
}

export const AuthProvider = ({ user }: Props) => {
	const { setProfile, setSubscriptions } = useProfile();

	useEffect(() => {
		if (user) {
			setProfile(user);
			setSubscriptions(user?.subscriptions);
		}
	}, [setProfile, setSubscriptions, user]);

	return null;
};
