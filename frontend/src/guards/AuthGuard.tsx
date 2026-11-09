'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

import { routesConfig } from '@/config';
import { useProfileStore } from '@/store';

export const AuthGuard = ({ children }: PropsWithChildren) => {
	const isAuth = useProfileStore((s) => s.isAuth);
	const isLoading = useProfileStore((s) => s.isLoading);
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuth) {
			router.replace(routesConfig.signin);
		}
	}, [isAuth, isLoading, router]);

	if (isLoading) return null;

	return isAuth ? children : null;
};
