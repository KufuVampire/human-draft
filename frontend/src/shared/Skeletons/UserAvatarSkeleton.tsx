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
					['-mt-16 md:-mt-[5.5rem] size-[8rem] md:size-[9.375rem] p-1 md:p-[0.313rem] rounded-full bg-[var(--background-color-card)] z-10 transition-colors']:
						location === 'profile-page',
					['bg-placeholder shrink-0 size-[5.625rem] rounded-lg']:
						location === 'users-page',
					['size-full rounded-full bg-[var(--background-color-card)] transition-colors']:
						location === 'settings-page',
				},
				className
			)}>
			<Skeleton
				className={cn('size-full rounded-lg', {
					['rounded-full']:
						location === 'profile-page' || location === 'settings-page',
				})}
			/>
		</div>
	);
};
