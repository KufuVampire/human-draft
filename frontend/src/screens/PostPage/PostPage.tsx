'use client';

import { useTranslations } from 'next-intl';
import { notFound, useParams, useRouter } from 'next/navigation';
import { lazy, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PostAuthorHeader } from './components/PostAuthorHeader';
import { PostStatsBar } from './components/PostStatsBar';
import { routesConfig } from '@/config';
import {
	GetPostByIdQuery,
	useDeletePostMutation,
	useTogglePinBlogMutation,
} from '@/graphql/generated/output';
import { usePost } from '@/hooks';
import { MilkdownContent } from '@/shared';
import { useModalStore, useProfileStore } from '@/store';
import { isNotFoundError } from '@/utils';

const CommentsLazy = lazy(() => import('@/modules/Comments/Comments'));

interface Props {
	initialData?: GetPostByIdQuery['getPostById'];
}

export const PostPage = ({ initialData }: Props = {}) => {
	const t = useTranslations();
	const router = useRouter();
	const { postId } = useParams<{ postId: string }>();
	const profile = useProfileStore((s) => s.profile);
	const openModal = useModalStore((s) => s.openModal);
	const [pinnedBlogId, setPinnedBlogId] = useState<string | null>(null);

	const {
		isLoading,
		error,
		post,
		content,
		title,
		author,
		createdAt,
		tags,
		likesCount,
		viewsCount,
		blog,
	} = usePost(postId, initialData);

	const isOwner = profile?.username === author?.username;

	const [deletePost] = useDeletePostMutation({
		onCompleted() {
			toast.success(t('postPage.postDeletedSuccess'));
			router.push(routesConfig.home);
		},
	});

	const [togglePin] = useTogglePinBlogMutation({
		onCompleted(data) {
			if (data.pinPostToBlog.blog) {
				setPinnedBlogId(data.pinPostToBlog.blog.id);
			}
		},
	});

	useEffect(() => {
		if (blog) {
			setPinnedBlogId(blog.id);
		}
	}, [blog]);

	const handleDeletePost = useCallback(() => {
		openModal('confirmationDeletion', {
			type: 'post',
			cb: () => deletePost({ variables: { postId } }),
		});
	}, [deletePost, openModal, postId]);

	const handleTogglePinBlog = useCallback(
		(blogId: string) => togglePin({ variables: { blogId, postId } }),
		[postId, togglePin]
	);

	useEffect(() => {
		if (isLoading) return;

		if (error) {
			if (isNotFoundError(error)) {
				notFound();
			}
			return;
		}

		if (!post) {
			notFound();
		}
	}, [isLoading, post, error]);

	if (error && !isNotFoundError(error)) {
		throw error;
	}

	if (isLoading || !post) {
		return null;
	}

	return (
		<div className='flex flex-col gap-y-8 bg-surface-card rounded-2xl border border-border-subtle shadow-sm transition-colors p-4 sm:p-6 md:p-10 w-full'>
			<article className='flex flex-col gap-y-6 w-full'>
				<PostAuthorHeader
					author={author}
					createdAt={createdAt}
					isOwner={isOwner}
					postId={postId}
					pinnedBlogId={pinnedBlogId}
					onTogglePinBlog={handleTogglePinBlog}
					onDeletePost={handleDeletePost}
				/>
				{title && (
					<h1 className='font-title font-bold leading-tight text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight'>
						{title}
					</h1>
				)}
				<MilkdownContent
					content={content}
					className='pb-8'
				/>
				<PostStatsBar
					postId={postId}
					tags={tags}
					likesCount={likesCount}
					viewsCount={viewsCount}
				/>
			</article>
			<div className='border-t border-border-subtle pt-8'>
				<CommentsLazy />
			</div>
		</div>
	);
};
