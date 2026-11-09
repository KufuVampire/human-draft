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
	const {
		posts,
		isPostsLoading,
		totalPages: postsTotalPages = 0,
	} = usePosts(params);
	const {
		blogs,
		isBlogsLoading,
		totalPages: blogsTotalPages = 0,
	} = useBlogs(params);

	const [allItems, setAllItems] = useState<PostsAndBlogs[]>([]);
	const isLoading = isPostsLoading || isBlogsLoading;

	const { onlySubscriptions, onlyPosts, onlyBlogs } = params.filters;

	// Reset when filters change or page resets to 1
	useEffect(() => {
		if (params.page === 1) {
			setAllItems([]);
		}
	}, [params.page, onlySubscriptions, onlyPosts, onlyBlogs]);

	useEffect(() => {
		if (isLoading) return;

		const currentPageItems = [...posts, ...blogs];

		if (params.page === 1) {
			setAllItems(currentPageItems);
		} else if (currentPageItems.length > 0) {
			setAllItems((prev) => {
				const map = new Map<string, PostsAndBlogs>();
				[...prev, ...currentPageItems].forEach((item) => {
					map.set(item.id, item);
				});
				return Array.from(map.values());
			});
		}
	}, [posts, blogs, isLoading, params.page]);

	const hasMore = useMemo(() => {
		if (isLoading) return true;

		if (onlyPosts && !onlyBlogs) {
			return params.page < (postsTotalPages ?? 0);
		}
		if (onlyBlogs && !onlyPosts) {
			return params.page < (blogsTotalPages ?? 0);
		}

		return (
			params.page < (postsTotalPages ?? 0) ||
			params.page < (blogsTotalPages ?? 0)
		);
	}, [
		isLoading,
		onlyPosts,
		onlyBlogs,
		params.page,
		postsTotalPages,
		blogsTotalPages,
	]);

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
		isLoading,
	};
};
