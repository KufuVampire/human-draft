'use client';

import { useMemo } from 'react';

import { routesConfig } from '@/config';
import { useProfileStore } from '@/store';

export const useResolvedHref = () => {
	const profile = useProfileStore((s) => s.profile);

	return useMemo(() => {
		return (href: string) => {
			if (!profile?.username) return href;

			if (href === routesConfig.settings) {
				return routesConfig.profileSettings(profile.username);
			}

			if (href === routesConfig.profile) {
				return routesConfig.profileUsername(profile.username);
			}

			return href;
		};
	}, [profile?.username]);
};
