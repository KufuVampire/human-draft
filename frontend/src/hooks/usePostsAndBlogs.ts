'use client';

import { useMemo } from 'react';

import { useBlogs } from './useBlogs';
import { usePosts } from './usePosts';

interface Params {
	page: number;
	perPage: number;
}

export const usePostsAndBlogs = (params: Params) => {
	const { posts } = usePosts(params);
	const { blogs } = useBlogs(params);

	const postsAndBlogs = useMemo(() => {
		const postsAndBlogs = [...posts, ...blogs];
		return postsAndBlogs.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	}, [blogs, posts]);

	return {
		posts,
		blogs,
		postsAndBlogs,
	};
};
