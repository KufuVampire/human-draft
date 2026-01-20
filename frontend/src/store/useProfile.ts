'use client';

import { create } from 'zustand';

import { UserModel } from '@/graphql/generated/output';

interface ProfileState {
	isAuth: boolean;
	isLoading: boolean;
	profile: UserModel | null;
	setProfile: (profile: UserModel) => void;
	setLoading: (isLoading: boolean) => void;
	setAuth: (isAuth: boolean) => void;
	logout: () => void;
}

export const useProfile = create<ProfileState>()((set) => ({
	isAuth: false,
	isLoading: true,
	profile: null,
	setLoading: (isLoading: boolean) => set({ isLoading }),
	setAuth: (isAuth: boolean) => set({ isAuth }),
	setProfile: (profile: UserModel) => {
		set({ profile, isAuth: true });
	},
	logout: () =>
		set({
			profile: null,
			isAuth: false,
		}),
}));
