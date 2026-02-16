import { Skeleton } from './Skeleton';
import { TagsListSkeleton } from './TagsListSkeleton';
import { UserBadgeWithCreatedAtSkeleton } from './UserBadgeWithCreatedAtSkeleton';

interface Props {
	isOwner?: boolean;
}

const arr = new Array(3).fill(0);

export const PostCardSkeleton = ({ isOwner = false }: Props) => {
	return (
		<li className='bg-[var(--background-color-card)] transition-all rounded-xl py-5 px-4 hover:shadow-primary border-t-16 border-primary lg:max-w-115 min-w-85 w-full'>
			<div className='flex flex-col gap-y-5 transition-colors hover:text-[var(--text-color-main)]'>
				<div className='flex flex-col gap-y-3'>
					<Skeleton className='w-full h-10 rounded-sm' />
					<div className='flex gap-x-3 items-center'>
						<UserBadgeWithCreatedAtSkeleton isOwner={isOwner} />
					</div>
					<div className='flex flex-col gap-y-3'>
						{arr.map((_, i) => (
							<Skeleton
								key={i}
								className='w-full h-6 rounded-sm'
							/>
						))}
					</div>
				</div>
				<TagsListSkeleton />
			</div>
		</li>
	);
};
