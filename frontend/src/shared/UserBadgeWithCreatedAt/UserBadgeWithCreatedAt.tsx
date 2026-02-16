import { UserBadgeLocation } from '@/types';
import { CustomLink } from '../CustomLink/CustomLink';
import { UserBadge } from '../UserBadge/UserBadge';

import { useCreateAt } from '@/hooks';
import { cn } from '@/utils';

interface Props {
	createdAt: string;
	author: {
		username: string;
		avatarUrl?: string | null;
	};
	isOwner?: boolean;
	isShow?: boolean;
	className?: string;
	location?: UserBadgeLocation
}

export const UserBadgeWithCreatedAt = ({
	createdAt,
	author,
	isOwner = false,
	isShow = false,
	className,
	location = 'post-card'
}: Props) => {
	const datetime = useCreateAt(createdAt);

	return (
		<div className={cn('flex gap-x-3 items-center', className)}>
			{!isOwner && !isShow && (
				<CustomLink href={`/${author.username}`}>
					<UserBadge
						location={location}
						avatarUrl={author.avatarUrl}
						username={author.username}
					/>
				</CustomLink>
			)}
			{isShow && (
				<UserBadge
					location={location}
					avatarUrl={author.avatarUrl}
					username={author.username}
				/>
			)}
			<time
				dateTime={datetime}
				className='font-light text-sm leading-[150%] text-placeholder'>
				{datetime}
			</time>
		</div>
	);
};
