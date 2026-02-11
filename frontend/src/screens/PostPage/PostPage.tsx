'use client';

import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { toast } from 'sonner';

import { routesConfig } from '@/config';
import { useDeletePostMutation } from '@/graphql/generated/output';
import { usePost } from '@/hooks';
import { Button, MilkdownContent, UserBadgeWithCreatedAt } from '@/shared';
import { useConfirmationDeletionModal, useProfile } from '@/store';

export const PostPage = () => {
	const t = useTranslations();
	const { postId } = useParams<{ postId: string }>();
	const { profile } = useProfile();
	const { content, author, createdAt } = usePost(postId);
	const { setOpen, setType, setCb } = useConfirmationDeletionModal();

	const isOwner = profile?.username === author?.username;

	const [deletePost] = useDeletePostMutation({
		onCompleted() {
			toast.success(t('postPage.postDeletedSuccess'));
			redirect(routesConfig.home);
		},
	});

	const handleDeletePost = () => {
		setType('post');
		setCb(() => {
			deletePost({
				variables: {
					postId,
				},
			});
			setOpen(false);
		});
		setOpen(true);
	};

	return (
		<article className='flex flex-col gap-y-6 bg-[var(--background-color-card)] rounded-xl px-2 py-6 md:px-6 w-full transition-colors'>
			<div className='flex flex-col md:flex-row gap-y-2 md:items-center justify-between'>
				{author && (
					<UserBadgeWithCreatedAt
						author={{ username: author.username, avatarUrl: author.avatarUrl }}
						createdAt={createdAt}
						isShow
					/>
				)}
				{isOwner && (
					<Button
						variant='secondary'
						className='dark:text-secondary py-2 px-3 font-title leading-[150%] rounded-lg'
						onClick={handleDeletePost}>
						Удалить пост
					</Button>
				)}
			</div>
			<MilkdownContent content={content} />
		</article>
	);
};
