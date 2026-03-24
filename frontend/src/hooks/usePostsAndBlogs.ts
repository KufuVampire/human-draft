'use client';

import { useEffect, useMemo, useState } from 'react';

import { GetAllBlogsQuery, GetAllPostsQuery } from '@/graphql/generated/output';
import { useBlogs } from './useBlogs';
import { usePosts } from './usePosts';

interface Params {
	page: number;
	perPage: number;
	filters: {
		onlySubscriptions: boolean;
		onlyPosts: boolean;
		onlyBlogs: boolean;
	};
}

type PostsAndBlogs =
	| GetAllPostsQuery['getAllPostsPagination']['data'][number]
	| GetAllBlogsQuery['getAllBlogsPagination']['data'][number];

export const usePostsAndBlogs = (params: Params) => {
	const { posts, isPostsLoading } = usePosts(params);
	const { blogs, isBlogsLoading } = useBlogs(params);
	const [allItems, setAllItems] = useState<PostsAndBlogs[]>([]);
	const [hasMore, setHasMore] = useState(true);

	const currentPageItems = useMemo(() => {
		return [...posts, ...blogs];
	}, [posts, blogs]);

	useEffect(() => {
		if (params.page === 1) {
			setAllItems([]);
			setHasMore(true);
		}
	}, [
		params.page,
		params.filters.onlySubscriptions,
		params.filters.onlyPosts,
		params.filters.onlyBlogs,
	]);

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
		posts,
		blogs,
		postsAndBlogs,
		hasMore,
		isLoading: isPostsLoading || isBlogsLoading,
	};
};
