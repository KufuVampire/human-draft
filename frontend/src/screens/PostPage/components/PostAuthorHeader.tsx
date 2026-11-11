import { PostHeaderActions } from './PostHeaderActions';
import { UserBadgeWithCreatedAt } from '@/shared';

interface Props {
	author?: {
		username: string;
		avatarUrl?: string | null;
	} | null;
	createdAt: string;
	isOwner: boolean;
	postId: string;
	pinnedBlogId: string | null;
	onTogglePinBlog: (blogId: string) => void;
	onDeletePost: () => void;
}

export const PostAuthorHeader = ({
	author,
	createdAt,
	isOwner,
	postId,
	pinnedBlogId,
	onTogglePinBlog,
	onDeletePost,
}: Props) => {
	return (
		<div className='flex flex-col md:flex-row gap-y-3 md:items-center justify-between border-b border-border-subtle pb-4'>
			{author && (
				<UserBadgeWithCreatedAt
					author={{
						username: author.username,
						avatarUrl: author.avatarUrl,
					}}
					createdAt={createdAt}
					isShow
				/>
			)}
			{isOwner && (
				<PostHeaderActions
					postId={postId}
					pinnedBlogId={pinnedBlogId}
					onTogglePinBlog={onTogglePinBlog}
					onDeletePost={onDeletePost}
				/>
			)}
		</div>
	);
};
