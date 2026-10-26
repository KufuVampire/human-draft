'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

import { routesConfig } from '@/config';
import { useProfile } from '@/hooks';
import { Skeleton } from '@/shared';

const AuthFormSkeleton = () => (
	<div
		data-testid='auth-form-skeleton'
		className='border-2 border-primary/20 p-3 rounded-xl flex flex-col gap-y-4 w-full'>
		<Skeleton className='h-9 w-36 mx-auto rounded-lg' />
		<div className='flex flex-col gap-y-2'>
			<Skeleton className='h-4 w-20 rounded' />
			<Skeleton className='h-10 w-full rounded-lg' />
		</div>
		<div className='flex flex-col gap-y-2'>
			<Skeleton className='h-4 w-20 rounded' />
			<Skeleton className='h-10 w-full rounded-lg' />
		</div>
		<Skeleton className='h-11 w-full rounded-xl mt-2' />
	</div>
);

export const GuestGuard = ({ children }: PropsWithChildren) => {
	const { isAuth, isLoading } = useProfile();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuth) {
			router.replace(routesConfig.home);
		}
	}, [isAuth, isLoading, router]);

	if (isLoading) return <AuthFormSkeleton />;

	return !isAuth ? children : null;
};
