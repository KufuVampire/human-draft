'use client';

import { create } from 'zustand';

import { UserModel } from '@/graphql/generated/output';

interface ProfileState {
	isAuth: boolean;
	isLoading: boolean;
	profile: UserModel | null;
	setProfile: (profile: UserModel | null) => void;
	setLoading: (isLoading: boolean) => void;
	setAuth: (isAuth: boolean) => void;
	logout: () => void;
	updateProfile: (profile: Partial<UserModel> | null) => void;
}

export const useProfile = create<ProfileState>((set, get) => ({
	isAuth: false,
	isLoading: true,
	profile: null,
	setLoading: (isLoading: boolean) => set({ isLoading }),
	setAuth: (isAuth: boolean) => set({ isAuth }),
	setProfile: (profile) =>
		set({ profile, isAuth: !!profile, isLoading: false }),
	updateProfile: (profile) => {
		const { profile: oldProfile } = get();
		if (!profile) return set({ profile: null });
		if (!oldProfile) return;
		set({ profile: { ...oldProfile, ...profile } });
	},
	logout: () =>
		set({
			profile: null,
			isAuth: false,
			isLoading: false,
		}),
}));
