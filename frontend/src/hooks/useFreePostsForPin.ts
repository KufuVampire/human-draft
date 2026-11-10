'use client';

import { type MouseEvent, useCallback, useMemo, useState } from 'react';
import type { FieldValues, Path, UseFormWatch } from 'react-hook-form';

import { useDebounce } from './useDebounce';
import { useGetAllFreePostsForPinQuery } from '@/graphql/generated/output';

interface Params<T extends FieldValues> {
	watch: UseFormWatch<T>;
	isDropdownOpen: boolean;
}

export const useFreePostsForPin = <T extends FieldValues>({
	watch,
	isDropdownOpen,
}: Params<T>) => {
	const [postIds, setPostIds] = useState<string[]>([]);
	const postSearchStr = watch('postSearchStr' as Path<T>);
	const searchStr = useDebounce(
		typeof postSearchStr === 'string' ? postSearchStr : ''
	);

	const postsData = useGetAllFreePostsForPinQuery({
		variables: {
			searchStr,
		},
		skip: !isDropdownOpen,
	});

	const posts = useMemo(
		() => postsData.data?.getFreePostsForPin || [],
		[postsData.data]
	);

	const handleClick = useCallback((e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const input = target.closest('input');
		if (!input) return;
		const postId = input.dataset.post;
		if (!postId) return;

		setPostIds((prev) => {
			if (prev.includes(postId)) {
				return prev.filter((id) => id !== postId);
			}
			return [...prev, postId];
		});
	}, []);

	return {
		postIds,
		setPostIds,
		posts,
		handleClick,
	};
};
