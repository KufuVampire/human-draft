import { CustomLink } from '../CustomLink/CustomLink';
import { UserBadge } from '../UserBadge/UserBadge';

import { useCreateAt } from '@/hooks';

interface Props {
	createdAt: string;
	author: {
		username: string;
		avatarUrl?: string | null;
	};
	isOwner?: boolean;
	isShow?: boolean;
}

export const UserBadgeWithCreatedAt = ({
	createdAt,
	author,
	isOwner = false,
	isShow = false,
}: Props) => {
	const datetime = useCreateAt(createdAt);

	return (
		<div className='flex gap-x-3 items-center'>
			{!isOwner && !isShow && (
				<CustomLink href={`/${author.username}`}>
					<UserBadge
						location='post-card'
						avatarUrl={author.avatarUrl}
						username={author.username}
					/>
				</CustomLink>
			)}
			{isShow && (
				<UserBadge
					location='post-card'
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
