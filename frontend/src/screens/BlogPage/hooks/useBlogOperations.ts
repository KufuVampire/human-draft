'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { ChangeEvent, Dispatch, MouseEvent } from 'react';
import { toast } from 'sonner';

import type { BlogPostsAction } from '../blog-posts.reducer';
import { routesConfig } from '@/config';
import {
	useChangeBlogPosterMutation,
	useDeleteBlogMutation,
	useDeleteBlogPosterMutation,
	useDeletePostMutation,
	usePinPostMutation,
	useUnPinPostMutation,
} from '@/graphql/generated/output';
import { useModalStore } from '@/store';

interface Params {
	blogId: string;
	dispatch: Dispatch<BlogPostsAction>;
	refetch: () => void;
	setPosterFile: (file: File | null) => void;
	setPosterUrl: (url: string | null) => void;
}

export const useBlogOperations = ({
	blogId,
	dispatch,
	refetch,
	setPosterFile,
	setPosterUrl,
}: Params) => {
	const t = useTranslations();
	const router = useRouter();
	const openModal = useModalStore((s) => s.openModal);

	const [pinPosts] = usePinPostMutation({
		onCompleted(res) {
			dispatch({ type: 'PIN', payload: res.pinPost });
			refetch();
		},
	});
	const [unpinPosts] = useUnPinPostMutation({
		onCompleted(res) {
			dispatch({ type: 'UNPIN', payload: res.unPinPost });
			refetch();
		},
	});
	const [deletePost] = useDeletePostMutation({
		onCompleted(res) {
			toast.success(t('postPage.postDeletedSuccess'));
			dispatch({ type: 'DELETE', payload: res.deletePost });
		},
	});
	const [deleteBlog] = useDeleteBlogMutation({
		onCompleted() {
			toast.success(t('blogPage.blogDeletedSuccess'));
			router.push(routesConfig.home);
		},
	});
	const [updatePoster, { loading: isPosterUpdating }] =
		useChangeBlogPosterMutation({
			onCompleted() {
				toast.success(t('blogPage.poster.updated'));
			},
			onError(err) {
				console.error(err);
				setPosterFile(null);
				toast.error(t('blogPage.poster.updateError'));
			},
		});
	const [deletePoster, { loading: isPosterDeleting }] =
		useDeleteBlogPosterMutation({
			onCompleted() {
				toast.success(t('blogPage.poster.deleted'));
			},
			onError(err) {
				console.error(err);
				toast.error(t('blogPage.poster.deleteError'));
			},
		});

	const handleDeletePost = (e: MouseEvent<HTMLUListElement>) => {
		const button = (e.target as HTMLElement).closest('button');
		const postId = button?.dataset.post;
		if (!postId) return;

		openModal('confirmationDeletion', {
			type: 'post',
			cb: () => deletePost({ variables: { postId } }),
		});
	};

	const handleDeleteBlog = () => {
		openModal('confirmationDeletion', {
			type: 'blog',
			cb: () => deleteBlog({ variables: { blogId } }),
		});
	};

	const handleChangePoster = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPosterFile(file);
		updatePoster({ variables: { blogId, posterFile: file } });
		e.target.value = '';
	};

	const handleDeletePoster = () => {
		openModal('confirmationDeletion', {
			type: 'poster',
			cb: () => {
				setPosterFile(null);
				setPosterUrl(null);
				deletePoster({ variables: { blogId } });
			},
		});
	};

	return {
		pinPosts,
		unpinPosts,
		isPosterUpdating,
		isPosterDeleting,
		handleDeletePost,
		handleDeleteBlog,
		handleChangePoster,
		handleDeletePoster,
	};
};
