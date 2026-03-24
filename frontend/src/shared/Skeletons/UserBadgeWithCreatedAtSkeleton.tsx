import { Skeleton } from './Skeleton';
import { UserBadgeSkeleton } from './UserBadgeSkeleton';

interface Props {
	isOwner?: boolean;
}

export const UserBadgeWithCreatedAtSkeleton = ({ isOwner = false }: Props) => {
	return (
		<div className='flex gap-x-3 items-center'>
			{!isOwner && <UserBadgeSkeleton location='post-card' />}
			<Skeleton className='h-4.5 w-20 rounded-xs' />
		</div>
	);
};
