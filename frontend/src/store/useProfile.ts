'use client';

import { create } from 'zustand';

import { UserModel } from '@/graphql/generated/output';

interface ProfileState {
	isAuth: boolean;
	profile: UserModel | null;
	setProfile: (profile: UserModel) => void;
	setAuth: (isAuth: boolean) => void;
	logout: () => void;
}

export const useProfile = create<ProfileState>()((set) => ({
	isAuth: false,
	profile: null,
	setAuth: (isAuth: boolean) => set(() => ({ isAuth })),
	setProfile: (profile: UserModel) => {
		set(() => ({ profile, isAuth: true }));
	},
	logout: () => {
		set({
			profile: null,
			isAuth: false,
		});
	},
}));
