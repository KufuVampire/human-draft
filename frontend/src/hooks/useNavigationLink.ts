'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { routesConfig } from '@/config';
import { useProfileStore } from '@/store';

export const useNavigationLink = (href: string) => {
	const pathname = usePathname();
	const profile = useProfileStore((s) => s.profile);

	const finalHref = useMemo(() => {
		if (!profile?.username) return href;

		if (href === routesConfig.settings) {
			return routesConfig.profileSettings(profile.username);
		}

		if (href === routesConfig.profile) {
			return routesConfig.profileUsername(profile.username);
		}

		return href;
	}, [href, profile?.username]);

	const isActive = useMemo(() => {
		return pathname === finalHref;
	}, [pathname, finalHref]);

	return { href: finalHref, isActive };
};
