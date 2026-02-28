'use client';

import { useGetAllPostsQuery } from '@/graphql/generated/output';

interface Params {
	page: number;
	perPage: number;
}

export const usePosts = ({ page, perPage }: Params) => {
	const { data, loading, error } = useGetAllPostsQuery({
		variables: { searchParams: { page, perPage } },
	});

	const paginationData = data?.getAllPostsPagination;

	return {
		posts: paginationData?.data || [],
		page: paginationData?.page,
		perPage: paginationData?.perPage,
		totalCount: paginationData?.totalCount,
		totalPages: paginationData?.totalPages,
		isPostsLoading: loading,
		postErrors: error,
	};
};
