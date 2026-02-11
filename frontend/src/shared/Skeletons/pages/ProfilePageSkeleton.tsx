import { cn } from '@/utils';
import { CreatePostBlogLInksSkeleton } from '../CreatePostBlogLInksSkeleton';
import { PosterSkeleton } from '../PosterSkeleton';
import { Skeleton } from '../Skeleton';
import { UserAvatarSkeleton } from '../UserAvatarSkeleton';

interface Props {
	isOwner: boolean;
}

export const ProfilePageSkeleton = ({ isOwner }: Props) => {
	return (
		<div className='flex flex-col w-full gap-y-6'>
			<div className='flex flex-col w-full py-0 md:py-0 bg-[var(--background-color-card)] rounded-xl overflow-hidden transition-colors'>
				<PosterSkeleton />
				<div className='flex lg:flex-row flex-col items-center gap-y-2 lg:items-stretch justify-between px-6 pb-6 md:py-3 min-h-[7.188rem]'>
					<div className='flex lg:flex-row flex-col items-center lg:items-stretch gap-x-3 gap-y-2'>
						<UserAvatarSkeleton />
						<div className='flex flex-col gap-y-2 items-center lg:items-stretch'>
							<Skeleton className='w-48 h-8 rounded-xl' />
							<Skeleton className='w-38 h-4 rounded-xl' />
							<Skeleton className='w-32 h-4 rounded-xl' />
						</div>
					</div>
					<Skeleton
						className={cn('w-53 h-10 rounded-xl', !isOwner && 'w-30')}
					/>
				</div>
			</div>
			{isOwner && <CreatePostBlogLInksSkeleton />}
		</div>
	);
};
