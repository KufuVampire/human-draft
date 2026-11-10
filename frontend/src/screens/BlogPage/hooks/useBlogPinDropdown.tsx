'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type MouseEvent, useCallback, useMemo } from 'react';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';

import { useDebounce } from '@/hooks';
import type { TypeSearchSchema } from '@/schemas';
import { FormField } from '@/shared';

interface PinnedPostItem {
	id: string;
	title: string;
}

interface Params {
	blogId: string;
	blogPosts: PinnedPostItem[];
	freePosts?: PinnedPostItem[];
	register: UseFormRegister<TypeSearchSchema>;
	watch: UseFormWatch<TypeSearchSchema>;
	onPinPost: (postId: string) => void;
	onUnpinPost: (postId: string) => void;
}

export const useBlogPinDropdown = ({
	blogPosts,
	freePosts = [],
	register,
	watch,
	onPinPost,
	onUnpinPost,
}: Params) => {
	const t = useTranslations();
	const postsSearchStr = useDebounce(watch('search') || '');

	const posts = useMemo(() => {
		const blogPostIds = new Set(blogPosts.map((p) => p.id));
		const uniqueFreePosts = freePosts.filter((p) => !blogPostIds.has(p.id));
		return [...uniqueFreePosts, ...blogPosts];
	}, [blogPosts, freePosts]);

	const dropdownItems = useMemo(() => {
		const normalizedSearch = postsSearchStr.toLowerCase().trim();

		return posts
			.filter((p) => p.title.toLowerCase().includes(normalizedSearch))
			.map(({ id, title }) => (
				<FormField
					key={id}
					type='checkbox'
					data-post={id}
					text={title}
					wrapperClassNames='w-full justify-end bg-surface-card'
					defaultChecked={blogPosts.some((p) => p.id === id)}
				/>
			));
	}, [posts, postsSearchStr, blogPosts]);

	const dropdownSearchField = useMemo(
		() => (
			<FormField
				{...register('search')}
				placeholder={t('blogPage.pinPosts.searchFieldPlaceholder')}
				className='border-none [&:not(:placeholder-shown)]:shadow-none p-0 rounded-none'
				wrapperClassNames='w-full border border-primary p-2 rounded-sm'
				inputWrapperClassName='flex items-center justify-between flex-row-reverse'>
				<Search />
			</FormField>
		),
		[register, t]
	);

	const dropdownAllItems = useMemo(
		() => [dropdownSearchField, ...dropdownItems],
		[dropdownSearchField, dropdownItems]
	);

	const handleTogglePin = useCallback(
		(e: MouseEvent<HTMLUListElement>) => {
			const target = e.target as HTMLElement;
			const checkbox = target.closest('input');
			if (!checkbox) return;

			const postId = checkbox.dataset.post;
			if (!postId) return;

			if (checkbox.checked) {
				onPinPost(postId);
			} else {
				onUnpinPost(postId);
			}
		},
		[onPinPost, onUnpinPost]
	);

	return { dropdownAllItems, handleTogglePin };
};
