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
		if (!post?.content) return '';
		return milkdownJsonToHtml(post.content, post.title);
	}, [post?.content, post?.title]);

	return {
		isLoading: loading,
		...post,
		rawContent: post?.content,
		content: postHtml,
	};
};
