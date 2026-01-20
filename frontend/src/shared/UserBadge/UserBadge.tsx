import { UserAvatar } from '../UserAvatar/UserAvatar';

import { cn } from '@/utils';

interface Props {
	username?: string;
	avatarUrl?: string | null;
	location?: 'profile-page' | 'users-page' | 'header' | 'burger-menu';
	className?: string;
}

export const UserBadge = ({
	username,
	avatarUrl,
	location,
	className,
}: Props) => {
	return (
		<>
			<UserAvatar
				username={username}
				avatarUrl={avatarUrl}
				location={location}
				className={className}
			/>
			<span
				className={cn('text-lg hover:text-primary-hovers', {
					['text-secondary']: location === 'burger-menu',
				})}>
				{username}
			</span>
		</>
	);
};
