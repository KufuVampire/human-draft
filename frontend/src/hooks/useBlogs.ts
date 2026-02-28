'use client';

import { useGetAllBlogsQuery } from '@/graphql/generated/output';

interface Params {
	page: number;
	perPage: number;
}

export const useBlogs = ({ page, perPage }: Params) => {
	const { data, loading, error } = useGetAllBlogsQuery({
		variables: {
			searchParams: {
				page,
				perPage,
			},
		},
	});

	const paginationData = data?.getAllBlogsPagination;

	return {
		blogs: paginationData?.data || [],
		page: paginationData?.page,
		perPage: paginationData?.perPage,
		totalCount: paginationData?.totalCount,
		totalPages: paginationData?.totalPages,
		isPostsLoading: loading,
		postErrors: error,
	};
};
