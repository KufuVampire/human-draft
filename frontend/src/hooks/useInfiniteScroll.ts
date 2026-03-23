'use client';

import { useCallback, useEffect, useRef } from 'react';

type UseInfiniteScrollProps = {
	onLoadMore: () => void;
	hasMore?: boolean;
	isLoading?: boolean;
	rootMargin?: string;
	threshold?: number;
};

export const useInfiniteScroll = ({
	onLoadMore,
	hasMore = true,
	isLoading = false,
	rootMargin = '200px',
	threshold = 0,
}: UseInfiniteScrollProps) => {
	const observerRef = useRef<IntersectionObserver | null>(null);

	const targetRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading) return;
			if (observerRef.current) observerRef.current.disconnect();

			observerRef.current = new IntersectionObserver(
				(entries) => {
					const firstEntry = entries[0];

					if (firstEntry.isIntersecting && hasMore && !isLoading) {
						onLoadMore();
					}
				},
				{
					root: null,
					rootMargin,
					threshold,
				}
			);

			if (node) observerRef.current.observe(node);
		},
		[onLoadMore, hasMore, isLoading, rootMargin, threshold]
	);

	useEffect(() => {
		return () => {
			if (observerRef.current) observerRef.current.disconnect();
		};
	}, []);

	return targetRef;
};
