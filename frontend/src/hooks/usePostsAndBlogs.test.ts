import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePostsAndBlogs } from './usePostsAndBlogs';

let mockPostsState: any = {
	posts: [],
	isPostsLoading: false,
	totalPages: 2,
};
let mockBlogsState: any = {
	blogs: [],
	isBlogsLoading: false,
	totalPages: 2,
};

vi.mock('./usePosts', () => ({
	usePosts: () => mockPostsState,
}));

vi.mock('./useBlogs', () => ({
	useBlogs: () => mockBlogsState,
}));

describe('usePostsAndBlogs', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockPostsState = {
			posts: [],
			isPostsLoading: false,
			totalPages: 2,
		};
		mockBlogsState = {
			blogs: [],
			isBlogsLoading: false,
			totalPages: 2,
		};
	});

	it('initializes with page 1 items', () => {
		mockPostsState.posts = [
			{ id: 'p1', title: 'Post 1', createdAt: '2026-01-01' },
		];
		mockBlogsState.blogs = [
			{ id: 'b1', title: 'Blog 1', createdAt: '2026-01-02' },
		];

		const { result } = renderHook(() =>
			usePostsAndBlogs({
				page: 1,
				perPage: 10,
				filters: {
					onlyPosts: false,
					onlyBlogs: false,
					onlySubscriptions: false,
				},
			})
		);

		expect(result.current.postsAndBlogs).toHaveLength(2);
		expect(result.current.hasMore).toBe(true);
	});

	it('appends page 2 items even when items count is identical to page 1', () => {
		mockPostsState.posts = [
			{ id: 'p1', title: 'Post 1', createdAt: '2026-01-01' },
		];
		mockBlogsState.blogs = [];

		const { result, rerender } = renderHook(
			({ page }) =>
				usePostsAndBlogs({
					page,
					perPage: 10,
					filters: {
						onlyPosts: false,
						onlyBlogs: false,
						onlySubscriptions: false,
					},
				}),
			{ initialProps: { page: 1 } }
		);

		expect(result.current.postsAndBlogs).toHaveLength(1);
		expect(result.current.postsAndBlogs[0].id).toBe('p1');

		// Advance to page 2 with exact same number of items (1 item)
		mockPostsState.posts = [
			{ id: 'p2', title: 'Post 2', createdAt: '2026-01-02' },
		];

		rerender({ page: 2 });

		expect(result.current.postsAndBlogs).toHaveLength(2);
		expect(result.current.postsAndBlogs.map((i) => i.id)).toEqual(['p2', 'p1']);
	});

	it('resets items when page resets to 1', () => {
		mockPostsState.posts = [
			{ id: 'p1', title: 'Post 1', createdAt: '2026-01-01' },
		];

		const { result, rerender } = renderHook(
			({ page }) =>
				usePostsAndBlogs({
					page,
					perPage: 10,
					filters: {
						onlyPosts: false,
						onlyBlogs: false,
						onlySubscriptions: false,
					},
				}),
			{ initialProps: { page: 1 } }
		);

		mockPostsState.posts = [
			{ id: 'p2', title: 'Post 2', createdAt: '2026-01-02' },
		];
		rerender({ page: 2 });
		expect(result.current.postsAndBlogs).toHaveLength(2);

		// Reset to page 1
		mockPostsState.posts = [
			{ id: 'p-new', title: 'New Post', createdAt: '2026-01-03' },
		];
		rerender({ page: 1 });

		expect(result.current.postsAndBlogs).toHaveLength(1);
		expect(result.current.postsAndBlogs[0].id).toBe('p-new');
	});
});
