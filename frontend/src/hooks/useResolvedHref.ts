'use client';

import { useMemo } from 'react';

import { useProfile } from './useProfile';
import { routesConfig } from '@/config';

export const useResolvedHref = () => {
	const { profile } = useProfile();

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
