import { Skeleton } from './Skeleton';

const arr = new Array(2).fill(0);

export const CreatePostBlogLInksSkeleton = () => {
	return (
		<div className='flex flex-col md:flex-row gap-x-6 gap-y-3'>
			{arr.map((_, index) => (
				<Skeleton
					key={index}
					className='w-full py-7 rounded-[0.625rem]'
				/>
			))}
		</div>
	);
};
