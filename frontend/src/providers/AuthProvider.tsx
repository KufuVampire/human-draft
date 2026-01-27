'use client';

import { useEffect } from 'react';

import { UserModel } from '@/graphql/generated/output';
import { useProfile } from '@/store';

interface Props {
	user: UserModel | null;
}

export const AuthProvider = ({ user }: Props) => {
	const setProfile = useProfile((s) => s.setProfile);

	useEffect(() => {
		setProfile(user);
	}, [setProfile, user]);

	return null;
};
