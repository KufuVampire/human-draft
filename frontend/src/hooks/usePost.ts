'use client';

import { useGetPostByIdQuery } from '@/graphql/generated/output';

export const usePost = (postId: string) => {
	const { data, loading } = useGetPostByIdQuery({
		variables: {
			postId,
		},
	});

	const post = data?.getPostById;

	return {
		isLoading: loading,
		...post,
		rawContent: post?.content,
		content: post?.content,
	};
};
