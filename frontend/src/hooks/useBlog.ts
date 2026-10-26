'use client';

import {
	GetBlogByIdQuery,
	useGetBlogByIdQuery,
} from '@/graphql/generated/output';

export const useBlog = (
	blogId: string,
	initialBlog?: GetBlogByIdQuery['getBlogById']
) => {
	const result = useGetBlogByIdQuery({
		variables: {
			blogId,
		},
		skip: !!initialBlog,
	});

	if (initialBlog && !result.data) {
		return {
			...result,
			data: { getBlogById: initialBlog },
			loading: false,
		};
	}

	return result;
};
