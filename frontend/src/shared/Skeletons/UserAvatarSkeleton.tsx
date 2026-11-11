import { Skeleton } from './Skeleton';
import { cn } from '@/utils';

interface Props {
	location?: 'profile-page' | 'users-page' | 'settings-page';
	className?: string;
}

export const UserAvatarSkeleton = ({
	location = 'profile-page',
	className,
}: Props) => {
	return (
		<div
			className={cn(
				'relative',
				{
					'-mt-16 md:-mt-20 size-32 md:size-36 p-1 md:p-1.5 rounded-full bg-surface-card z-10 transition-colors':
						location === 'profile-page',
					'bg-surface-tag shrink-0 size-12 sm:size-16 rounded-xl':
						location === 'users-page',
					'size-full rounded-full bg-surface-card transition-colors':
						location === 'settings-page',
				},
				className
			)}>
			<Skeleton
				className={cn('size-full', {
					'rounded-full':
						location === 'profile-page' || location === 'settings-page',
					'rounded-xl': location === 'users-page',
				})}
			/>
		</div>
	);
};
