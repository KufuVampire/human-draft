import { Skeleton } from './Skeleton';
import { cn } from '@/utils';

interface Props {
	location?: 'post-card' | 'header' | 'burger-menu';
}

export const UserBadgeSkeleton = ({ location }: Props) => {
	return (
		<div className='flex gap-x-2 items-center'>
			<div
				className={cn('overflow-hidden', {
					['rounded-sm size-7.5']: location === 'post-card',
					['rounded-xl size-10']: location === 'header',
					['rounded-sm size-6 ']: location === 'burger-menu',
				})}>
				<Skeleton className='w-full h-full rounded-sm' />
			</div>
			<Skeleton className='h-6 w-19 rounded-sm' />
		</div>
	);
};
