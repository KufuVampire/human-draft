'use client';

import {
	GetPostByIdQuery,
	useGetPostByIdQuery,
} from '@/graphql/generated/output';

export const usePost = (
	postId: string,
	initialPost?: GetPostByIdQuery['getPostById']
) => {
	const { data, loading, error } = useGetPostByIdQuery({
		variables: {
			postId,
		},
		skip: !!initialPost,
	});

	const post = data?.getPostById ?? initialPost;

	return {
		isLoading: !post && loading,
		error,
		post,
		...post,
		rawContent: post?.content,
		content: post?.content,
	};
};
