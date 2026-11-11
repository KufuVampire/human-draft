import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useBlogs } from './useBlogs';
import { usePosts } from './usePosts';

vi.mock('@/graphql/generated/output', () => ({
	useGetAllPostsQuery: () => ({ data: undefined, loading: false, error: undefined }),
	useGetAllBlogsQuery: () => ({ data: undefined, loading: false, error: undefined }),
}));

const params = {
	page: 1,
	perPage: 10,
	filters: { onlySubscriptions: false, onlyPosts: false, onlyBlogs: true },
};

describe('usePosts и useBlogs без данных (запрос пропущен фильтром)', () => {
	it('usePosts между рендерами отдаёт один и тот же пустой массив', () => {
		const { result, rerender } = renderHook(() => usePosts(params));
		const first = result.current.posts;
		rerender();
		expect(result.current.posts).toHaveLength(0);
		expect(result.current.posts).toBe(first);
	});

	it('useBlogs между рендерами отдаёт один и тот же пустой массив', () => {
		const { result, rerender } = renderHook(() => useBlogs(params));
		const first = result.current.blogs;
		rerender();
		expect(result.current.blogs).toHaveLength(0);
		expect(result.current.blogs).toBe(first);
	});
});
