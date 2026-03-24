'use client';

import { useGetBlogByIdQuery } from '@/graphql/generated/output';

export const useBlog = (blogId: string) => {
	return useGetBlogByIdQuery({
		variables: {
			blogId,
		},
	});
};
