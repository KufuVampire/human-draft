'use client';

import { Search } from 'lucide-react';
import { type MouseEvent, useCallback, useMemo, useState } from 'react';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';

import { useGetBlogsForPinQuery } from '@/graphql/generated/output';
import { useDebounce } from '@/hooks';
import type { TypeCreatePostSchema } from '@/schemas';
import { FormField } from '@/shared';

interface Params {
	register: UseFormRegister<TypeCreatePostSchema>;
	watch: UseFormWatch<TypeCreatePostSchema>;
	isOpen: boolean;
	placeholder: string;
}

export const usePinBlogItems = ({
	register,
	watch,
	isOpen,
	placeholder,
}: Params) => {
	const [blogIdForPin, setBlogIdForPin] = useState<string | null>(null);

	const { data } = useGetBlogsForPinQuery({
		skip: !isOpen,
	});

	const searchStr = useDebounce(watch('search'));

	const handlePickBlogForPin = useCallback((e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const radio = target.closest('input');
		if (!radio) return;

		const blogId = radio.dataset.blog;
		if (!blogId) return;

		setBlogIdForPin(blogId);
	}, []);

	const drodownSearchField = useMemo(
		() => (
			<FormField
				{...register('search')}
				placeholder={placeholder}
				className='border-none [&:not(:placeholder-shown)]:shadow-none p-0 rounded-none'
				wrapperClassNames='w-full border border-primary p-2 rounded-sm'
				inputWrapperClassName='flex items-center justify-between flex-row-reverse'>
				<Search />
			</FormField>
		),
		[register, placeholder]
	);

	const dropdownItems = useMemo(() => {
		const blogs = data?.blogsForPin || [];
		const normalizedSearchStr = searchStr.toLowerCase().trim();
		return blogs
			.filter((b) => b.title.toLowerCase().includes(normalizedSearchStr))
			.map(({ id, title }) => (
				<FormField
					key={id}
					type='radio'
					data-blog={id}
					text={title}
					wrapperClassNames='w-full justify-end bg-surface-card'
					name='pin-blog'
					defaultChecked={id === blogIdForPin}
				/>
			));
	}, [blogIdForPin, data, searchStr]);

	const allDropdownItems = useMemo(
		() => [drodownSearchField, ...dropdownItems],
		[drodownSearchField, dropdownItems]
	);

	return {
		blogIdForPin,
		allDropdownItems,
		handlePickBlogForPin,
	};
};
