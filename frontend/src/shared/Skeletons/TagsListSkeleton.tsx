import { Skeleton } from './Skeleton';

export const TagsListSkeleton = () => {
	return (
		<ul className='flex flex-wrap gap-2'>
			<li className='rounded-[0.125rem] cursor-default bg-secondary dark:bg-placeholder transition-colors rounded-xs'>
				<Skeleton className='w-16 h-5.5 rounded-xs' />
			</li>
			<li className='rounded-[0.125rem] cursor-default bg-secondary dark:bg-placeholder transition-colors rounded-xs'>
				<Skeleton className='w-30 h-5.5 rounded-xs' />
			</li>
			<li className='rounded-[0.125rem] cursor-default bg-secondary dark:bg-placeholder transition-colors rounded-xs'>
				<Skeleton className='w-45 h-5.5 rounded-xs' />
			</li>
			<li className='rounded-[0.125rem] cursor-default bg-secondary dark:bg-placeholder transition-colors rounded-xs'>
				<Skeleton className='w-22 h-5.5 rounded-xs' />
			</li>
			<li className='rounded-[0.125rem] cursor-default bg-secondary dark:bg-placeholder transition-colors rounded-xs'>
				<Skeleton className='w-20 h-5.5 rounded-xs' />
			</li>
		</ul>
	);
};
