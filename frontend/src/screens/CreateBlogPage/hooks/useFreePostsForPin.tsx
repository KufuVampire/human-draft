'use client';

import { Search } from 'lucide-react';
import { type MouseEvent, useMemo, useState } from 'react';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';

import { useGetAllFreePostsForPinQuery } from '@/graphql/generated/output';
import { useDebounce } from '@/hooks';
import type { TypeCreateBlogSchema } from '@/schemas';
import { FormField } from '@/shared';

interface Params {
	register: UseFormRegister<TypeCreateBlogSchema>;
	watch: UseFormWatch<TypeCreateBlogSchema>;
	isDropdownOpen: boolean;
	placeholder: string;
}

export const useFreePostsForPin = ({
	register,
	watch,
	isDropdownOpen,
	placeholder,
}: Params) => {
	const [postIds, setPostIds] = useState<string[]>([]);
	const postSearchStr = watch('postSearchStr');
	const searchStr = useDebounce(postSearchStr || '');

	const postsData = useGetAllFreePostsForPinQuery({
		variables: {
			searchStr,
		},
		skip: !isDropdownOpen,
	});

	const posts = postsData.data?.getFreePostsForPin;

	const dropdownItems =
		useMemo(() => {
			return posts?.map(({ id, title }) => (
				<FormField
					key={id}
					type='checkbox'
					data-post={id}
					text={title}
					wrapperClassNames='w-full justify-end bg-surface-card'
				/>
			));
		}, [posts]) || [];

	const handleClick = (e: MouseEvent<HTMLUListElement>) => {
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
	};

	const searchField = (
		<FormField
			{...register('postSearchStr')}
			placeholder={placeholder}
			className='border-none [&:not(:placeholder-shown)]:shadow-none p-0 rounded-none'
			wrapperClassNames='w-full border border-primary p-2 rounded-sm'
			inputWrapperClassName='flex items-center justify-between flex-row-reverse'>
			<Search />
		</FormField>
	);

	return { postIds, setPostIds, dropdownItems, searchField, handleClick };
};
