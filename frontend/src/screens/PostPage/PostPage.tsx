'use client';

import { Eye, Heart, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { routesConfig } from '@/config';
import {
	GetPostByIdDocument,
	useDeletePostMutation,
	useUpdatePostMutation,
} from '@/graphql/generated/output';
import { useLocalStorage, usePost } from '@/hooks';
import { Comments } from '@/modules';
import {
	Button,
	CustomLink,
	MilkdownContent,
	TagsList,
	UserBadgeWithCreatedAt,
} from '@/shared';
import { useConfirmationDeletionModal, useProfile } from '@/store';
import { cn } from '@/utils';

const isLikeExpired = (date: number) => {
	if (!date) return true;

	const now = Date.now();
	const diff = now - date;

	return diff >= 24 * 60 * 60 * 1000;
};

interface ILikedAt {
	postId: string,
	date: number,
	isLiked: boolean,
	userId: string | null
}

export const PostPage = () => {
	const t = useTranslations();
	const { postId } = useParams<{ postId: string }>();
	const { profile, isAuth } = useProfile();
	const [likedAt, setLikedAt] = useLocalStorage<ILikedAt[]>(`likedAt`, []);
	const {
		isLoading,
		content,
		author,
		createdAt,
		tags,
		commentsCount,
		comments,
		likesCount,
		viewsCount,
	} = usePost(postId);
	const { setOpen, setType, setCb } = useConfirmationDeletionModal();

	const isOwner = profile?.username === author?.username;

	const [deletePost] = useDeletePostMutation({
		onCompleted() {
			toast.success(t('postPage.postDeletedSuccess'));
			redirect(routesConfig.home);
		},
	});

	const [updatePost, { loading: isUpdating }] = useUpdatePostMutation({
		refetchQueries: [
			{
				query: GetPostByIdDocument,
				variables: { postId },
			},
		],
		awaitRefetchQueries: true,
	});

	useEffect(() => {
		if (isLoading) return;
		const timer = setTimeout(() => {
			updatePost({
				variables: {
					postId,
					data: {
						viewsCount: viewsCount ? viewsCount + 1 : 1,
					},
				},
			});
		}, 10000);
		return () => clearTimeout(timer);
	}, [isLoading]);

	if (isLoading) {
		return;
	}

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

	const handleLike = () => {
		if (!isAuth) {
			return;
		}

		const likedAtObj = likedAt.find((el) => el.userId === profile?.id)

		if (likedAtObj?.isLiked && !isLikeExpired(likedAtObj.date) && likedAtObj.postId === postId && likedAtObj.userId === profile?.id) {
			return;
		}

		updatePost({
			variables: {
				postId,
				data: {
					likesCount: likesCount ? likesCount + 1 : 1,
				},
			},
		});
		setLikedAt(prev => [...prev, { postId, date: Date.now(), isLiked: true, userId: profile ? profile.id : null }]);
	};

	const likedAtObj = likedAt.find((el) => el.userId === profile?.id)

	return (
		<div className='flex flex-col gap-y-8 bg-[var(--background-color-card)] rounded-xl transition-colors px-2 py-6 md:px-6'>
			<article className='flex flex-col gap-y-6 w-full'>
				<div className='flex flex-col md:flex-row gap-y-2 md:items-center justify-between'>
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
						<div className='flex items-center gap-x-2'>
							<Button
								variant='secondary'
								className='dark:text-secondary py-1.75 px-3 font-title font-bold leading-[150%] rounded-lg md:w-auto w-full max-w-32.5'
								onClick={handleDeletePost}>
								{t('btns.remove')}
							</Button>

							<CustomLink
								variant='primary'
								href={routesConfig.postUpdate(postId)}
								className='py-2 px-3 font-title font-bold leading-[150%] rounded-lg'>
								{t('postPage.editPost')}
							</CustomLink>
						</div>
					)}
				</div>
				<MilkdownContent
					content={content}
					className='border-b border-primary pb-6'
				/>
				<div className='flex flex-col gap-y-6 md:flex-row justify-between'>
					{tags && <TagsList tags={tags} />}
					<ul className='flex gap-x-6'>
						<li>
							<Button
								variant='clear'
								className={cn(
									'flex items-center gap-x-2',
									likedAtObj?.isLiked && 'hover:text-[--text-color-main]'
								)}
								disabled={
									isUpdating ||
									(likedAtObj?.isLiked && !isLikeExpired(likedAtObj?.date))
								}
								onClick={handleLike}>
								<Heart
									className={cn(
										likedAtObj?.isLiked &&
											!isLikeExpired(likedAtObj?.date) && likedAtObj?.userId === profile?.id &&
											'stroke-red-500 fill-red-500'
									)}
								/>
								<span className='text-xs font-medium'>{likesCount}</span>
							</Button>
						</li>
						<li className='flex items-center gap-x-2'>
							<MessageSquare />
							<span className='text-xs font-medium'>{commentsCount}</span>
						</li>
						<li className='flex items-center gap-x-2'>
							<Eye />
							<span className='text-xs font-medium'>{viewsCount}</span>
						</li>
					</ul>
				</div>
			</article>
			<Comments commentsList={comments} />
		</div>
	);
};
