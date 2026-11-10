'use client';

import { Skeleton, UserAvatarSkeleton } from '@/shared';

interface Props {
	count: number;
	prefix?: string;
}

export const UsersSkeletonList = ({ count, prefix = 'skel' }: Props) => {
	const items = new Array(count).fill(0);

	return (
		<ul className='grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 md:gap-6 bg-surface-card px-5 py-4 rounded-xl transition-colors'>
			{items.map((_, i) => (
				<li
					key={`${prefix}-${i}`}
					className='w-full border border-primary rounded-xl transition-shadow'>
					<div className='flex w-full p-2 gap-x-4'>
						<UserAvatarSkeleton location='users-page' />
						<div className='flex flex-col gap-y-2 w-full'>
							<Skeleton className='w-2/3 h-5.5 rounded-sm' />
							<Skeleton className='w-full h-6 rounded-sm' />
							<Skeleton className='self-start max-w-32 w-full h-6.5 rounded-sm' />
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};
