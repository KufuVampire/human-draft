'use client';

import { useGetAllPostsQuery } from '@/graphql/generated/output';

interface Params {
	page: number;
	perPage: number;
	filters: {
		onlySubscriptions: boolean;
		onlyPosts: boolean;
		onlyBlogs: boolean;
	};
}

export const usePosts = ({ page, perPage, filters }: Params) => {
	const { onlySubscriptions, onlyBlogs, onlyPosts } = filters;
	const { data, loading, error } = useGetAllPostsQuery({
		variables: {
			searchParams: { page, perPage },
			filters: { onlySubscriptions },
		},
		skip: !onlyPosts && onlyBlogs,
	});

	const paginationData = data?.getAllPostsPagination;

	return {
		posts: paginationData?.data || [],
		page: paginationData?.page,
		perPage: paginationData?.perPage,
		totalCount: paginationData?.totalCount,
		totalPages: paginationData?.totalPages,
		isPostsLoading: loading,
		postsErrors: error,
	};
};
