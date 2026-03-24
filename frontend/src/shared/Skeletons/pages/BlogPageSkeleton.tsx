import { PostCardSkeleton } from '../PostCardSkeleton';
import { Skeleton } from '../Skeleton';
import { TagsListSkeleton } from '../TagsListSkeleton';

interface Props {
	isOwner?: boolean;
}

const arr = new Array(6).fill(0);

export const BlogPageSkeleton = ({ isOwner = false }: Props) => {
	return (
		<div className='flex flex-col gap-y-6 w-full'>
			<div className='py-0 md:py-0 relative overflow-hidden rounded-xl bg-placeholder before:absolute before:inset-0 before:bg-[rgba(0,0,0,0.4)] before:z-0 bg-no-repeat bg-size-[100%_330px]'>
				<div className='w-full p-3 pt-16 md:p-6 md:pt-10 z-10 relative min-h-82.5 flex flex-col justify-between'>
					<div className='w-full flex flex-col gap-y-7.5 md:gap-y-12'>
						<Skeleton className='self-center w-2/5 h-13 rounded-xs' />
						<div className='flex flex-col gap-y-4'>
							<Skeleton className='w-3/5 h-6 rounded-xs' />
							<TagsListSkeleton />
						</div>
						{isOwner && (
							<div className='flex gap-x-2 self-end'>
								<Skeleton className='px-3 py-2 rounded-lg h-10 w-42' />
								<Skeleton className='p-2 rounded-lg h-10 w-10' />
							</div>
						)}
					</div>
				</div>
			</div>
			{isOwner && (
				<div className='flex flex-col-reverse md:flex-row gap-2'>
					<Skeleton className='w-full h-10.5 rounded-lg' />
					<div className='flex gap-x-2'>
						<Skeleton className='h-10.5 px-3 py-2 w-22.5 rounded-lg' />
						<Skeleton className='h-10.5 px-3 py-2 w-45 rounded-lg' />
					</div>
				</div>
			)}
			{isOwner && <Skeleton className='w-full h-14 rounded-[0.625rem]' />}
			<ul className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{arr.map((_, index) => (
					<PostCardSkeleton
						isOwner={isOwner}
						key={index}
					/>
				))}
			</ul>
		</div>
	);
};
