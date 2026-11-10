'use client';

import { UserBadgeWithCreatedAt } from '../UserBadgeWithCreatedAt/UserBadgeWithCreatedAt';
import { CommentItemActions } from './CommentItemActions';
import { cn } from '@/utils';

interface Props {
	username: string;
	avatarUrl?: string | null;
	createdAt: string;
	parentId?: string | null;
	id: string;
	isOwner: boolean;
	isEditMode: boolean;
	onToggleEditMode: () => void;
	onDeleteComment: (id: string) => void;
}

export const CommentItemHeader = ({
	username,
	avatarUrl,
	createdAt,
	parentId,
	id,
	isOwner,
	isEditMode,
	onToggleEditMode,
	onDeleteComment,
}: Props) => {
	return (
		<div
			className={cn(
				'flex items-center justify-between relative',
				parentId &&
					'after:content-[""] after:absolute after:top-4 after:-left-5 after:w-5 after:h-0.25 after:bg-placeholder'
			)}>
			<UserBadgeWithCreatedAt
				author={{ username, avatarUrl }}
				createdAt={createdAt}
				location='comment-item'
				className='z-10'
			/>
			{isOwner && (
				<CommentItemActions
					isEditMode={isEditMode}
					onToggleEditMode={onToggleEditMode}
					onDeleteComment={() => onDeleteComment(id)}
				/>
			)}
		</div>
	);
};
