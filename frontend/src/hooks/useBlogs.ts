'use client';

import { useGetAllBlogsQuery } from '@/graphql/generated/output';

interface Params {
	page: number;
	perPage: number;
	filters: {
		onlySubscriptions: boolean;
		onlyPosts: boolean;
		onlyBlogs: boolean;
	};
}

export const useBlogs = ({ page, perPage, filters }: Params) => {
	const { onlySubscriptions, onlyPosts, onlyBlogs } = filters;
	const { data, loading, error } = useGetAllBlogsQuery({
		variables: {
			searchParams: { page, perPage },
			filters: { onlySubscriptions },
		},
		skip: !onlyBlogs && onlyPosts,
	});

	const paginationData = data?.getAllBlogsPagination;

	return {
		blogs: paginationData?.data || [],
		page: paginationData?.page,
		perPage: paginationData?.perPage,
		totalCount: paginationData?.totalCount,
		totalPages: paginationData?.totalPages,
		isBlogsLoading: loading,
		blogsErrors: error,
	};
};
