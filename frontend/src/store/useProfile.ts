'use client';

import { create } from 'zustand';

import { TypeUserProfile } from '@/schemas';

interface ProfileState {
	isAuth: boolean;
	isLoading: boolean;
	profile: TypeUserProfile | null;
	setProfile: (profile: TypeUserProfile) => void;
	setAuth: (isAuth: boolean) => void;
	setLoading: (isLoading: boolean) => void;
	logout: () => void;
}

export const useProfile = create<ProfileState>()((set) => ({
	isAuth: false,
	isLoading: false,
	profile: null,
	setAuth: (isAuth: boolean) => set(() => ({ isAuth })),
	setLoading: (isLoading: boolean) => set(() => ({ isLoading })),
	setProfile: (profile: TypeUserProfile) => {
		set(() => ({ profile, isAuth: true }));
	},
	logout: () => {
		if (typeof document !== 'undefined') {
			document.cookie = `token=; path=/; max-age=0; secure; samesite=strict`;
		}

		set({
			profile: null,
			isAuth: false,
		});
	},
}));
