'use client';

import { useMemo } from 'react';

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

	const initialData = useMemo(
		() => (initialBlog ? { getBlogById: initialBlog } : undefined),
		[initialBlog]
	);

	if (initialBlog && !result.data) {
		return {
			...result,
			data: initialData,
			loading: false,
		};
	}

	return result;
};
