import { CustomLink } from '../CustomLink/CustomLink';
import { UserBadge } from '../UserBadge/UserBadge';

import { routesConfig } from '@/config';
import { useCreateAt } from '@/hooks';
import { UserBadgeLocation } from '@/types';
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
	location?: UserBadgeLocation;
	type?: 'link' | 'not-link';
}

export const UserBadgeWithCreatedAt = ({
	createdAt,
	author,
	isOwner = false,
	isShow = false,
	className,
	location = 'post-card',
	type = 'link',
}: Props) => {
	const datetime = useCreateAt(createdAt);

	return (
		<div className={cn('flex gap-x-3 items-center', className)}>
			{!isOwner && !isShow && type === 'link' && (
				<CustomLink href={routesConfig.profileUsername(author.username)}>
					<UserBadge
						location={location}
						avatarUrl={author.avatarUrl}
						username={author.username}
					/>
				</CustomLink>
			)}
			{!isOwner && !isShow && type === 'not-link' && (
				<UserBadge
					location={location}
					avatarUrl={author.avatarUrl}
					username={author.username}
				/>
			)}
			{isShow && type === 'link' && (
				<CustomLink href={routesConfig.profileUsername(author.username)}>
					<UserBadge
						location={location}
						avatarUrl={author.avatarUrl}
						username={author.username}
					/>
				</CustomLink>
			)}
			{isShow && type === 'not-link' && (
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
