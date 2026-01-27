'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

import { routesConfig } from '@/config';
import { useProfile } from '@/hooks';

export const AuthGuard = ({ children }: PropsWithChildren) => {
	const { isAuth, isLoading } = useProfile();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuth) {
			router.replace(routesConfig.signin);
		}
	}, [isAuth, isLoading, router]);

	if (isLoading) return null;

	return isAuth ? children : null;
};
