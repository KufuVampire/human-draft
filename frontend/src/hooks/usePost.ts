'use client';

import { useMemo } from 'react';

import { useGetPostByIdQuery } from '@/graphql/generated/output';
import { milkdownJsonToHtml } from '@/utils';

export const usePost = (postId: string) => {
	const { data, loading } = useGetPostByIdQuery({
		variables: {
			postId,
		},
	});

	const post = data?.getPostById;
	const postHtml = useMemo(() => {
		if (!post) return '';
		return milkdownJsonToHtml(post.content, post.title);
	}, [post]);

	return {
		isLoading: loading,
		...post,
		rawContent: post?.content,
		content: postHtml,
	};
};
