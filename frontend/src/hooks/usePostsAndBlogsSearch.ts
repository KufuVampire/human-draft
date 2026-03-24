'use client';

import { useEffect, useMemo, useState } from 'react';

import {
	GetAllBlogsQuery,
	GetAllPostsQuery,
	useGetAllBlogsQuery,
	useGetAllPostsQuery,
} from '@/graphql/generated/output';

interface Params {
	page: number;
	perPage: number;
	search: string;
}

type PostsAndBlogs =
	| GetAllPostsQuery['getAllPostsPagination']['data'][number]
	| GetAllBlogsQuery['getAllBlogsPagination']['data'][number];

export const usePostsAndBlogsSearch = (params: Params) => {
	const { page, perPage, search } = params;

	const {
		data: postsData,
		loading: isPostsLoading,
	} = useGetAllPostsQuery({
		variables: {
			searchParams: { page, perPage },
			filters: { search },
		},
		skip: search.length < 3,
	});

	const {
		data: blogsData,
		loading: isBlogsLoading,
	} = useGetAllBlogsQuery({
		variables: {
			searchParams: { page, perPage },
			filters: { search },
		},
		skip: search.length < 3,
	});

	const [allItems, setAllItems] = useState<PostsAndBlogs[]>([]);
	const [hasMore, setHasMore] = useState(true);

	const currentPageItems = useMemo(() => {
		const paginationPostsData = postsData?.getAllPostsPagination.data || [];
		const paginationBlogsData = blogsData?.getAllBlogsPagination.data || [];

		return [...paginationPostsData, ...paginationBlogsData];
	}, [postsData, blogsData]);

	useEffect(() => {
		if (params.page === 1) {
			setAllItems([]);
			setHasMore(true);
		}
	}, [params.page, params.search]);

	useEffect(() => {
		if (!currentPageItems.length) {
			setHasMore(false);
			return;
		}

		setAllItems((prev) => {
			const map = new Map<string, PostsAndBlogs>();

			[...prev, ...currentPageItems].forEach((item) => {
				map.set(item.id, item);
			});

			return Array.from(map.values());
		});
	}, [currentPageItems.length]);

	const postsAndBlogs = useMemo(() => {
		return [...allItems].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	}, [allItems]);

	return {
		postsAndBlogs,
		hasMore,
		isLoading: isPostsLoading || isBlogsLoading,
	};
};
