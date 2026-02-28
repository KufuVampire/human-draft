import Image from 'next/image';
import { PropsWithChildren } from 'react';

import { useProfile } from '@/hooks';

interface Props {
	isOwner: boolean;
	user?: {
		posterUrl?: string | null;
	};
}

export const ProfilePoster = ({
	isOwner,
	children,
	user,
}: PropsWithChildren<Props>) => {
	const { profile } = useProfile();

	return (
		<div className='min-h-50 md:min-h-62.5 max-h-50 md:max-h-62.5 bg-placeholder relative'>
			{!isOwner && user?.posterUrl && (
				<Image
					src={user.posterUrl}
					alt='poster'
					fill
					sizes='100%'
					className='object-cover'
					priority
					loading='eager'
					unoptimized
					fetchPriority='high'
				/>
			)}
			{isOwner && profile?.posterUrl && (
				<Image
					src={profile.posterUrl}
					alt='poster'
					fill
					sizes='100%'
					className='object-cover'
					priority
					loading='eager'
					unoptimized
					fetchPriority='high'
				/>
			)}
			{children}
		</div>
	);
};
