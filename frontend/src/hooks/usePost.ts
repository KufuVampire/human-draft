'use client';

import { useGetPostByIdQuery } from '@/graphql/generated/output';

export const usePost = (postId: string) => {
	const { data, loading, error } = useGetPostByIdQuery({
		variables: {
			postId,
		},
	});

	const post = data?.getPostById;

	return {
		isLoading: loading,
		error,
		post,
		...post,
		rawContent: post?.content,
		content: post?.content,
	};
};
