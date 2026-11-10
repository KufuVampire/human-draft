'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type Dispatch, type MouseEvent, type SetStateAction, useMemo } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import { Button, Dropdown, FormField } from '@/shared';
import { cn } from '@/utils';

interface PostItem {
	id: string;
	title: string;
}

interface Props<T extends FieldValues> {
	posts: PostItem[];
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	register: UseFormRegister<T>;
	onClick: (e: MouseEvent<HTMLUListElement>) => void;
}

export const BlogPinnedPostsDropdown = <T extends FieldValues>({
	posts,
	isOpen,
	setOpen,
	register,
	onClick,
}: Props<T>) => {
	const t = useTranslations();

	const searchField = useMemo(
		() => (
			<FormField
				{...register('postSearchStr' as Path<T>)}
				placeholder={t('blogPage.pinPosts.searchFieldPlaceholder')}
				className='border-none [&:not(:placeholder-shown)]:shadow-none p-0 rounded-none'
				wrapperClassNames='w-full border border-primary p-2 rounded-sm'
				inputWrapperClassName='flex items-center justify-between flex-row-reverse'>
				<Search />
			</FormField>
		),
		[register, t]
	);

	const items = useMemo(() => {
		const postFields = posts.map(({ id, title }) => (
			<FormField
				key={id}
				type='checkbox'
				data-post={id}
				text={title}
				wrapperClassNames='w-full justify-end bg-surface-card'
			/>
		));
		return [searchField, ...postFields];
	}, [posts, searchField]);

	return (
		<Dropdown
			items={items}
			isOpen={isOpen}
			setOpen={setOpen}
			listClassName='w-full top-[calc(100%+0.5rem)] overflow-hidden py-3 px-2.5 shadow-secondary'
			onClick={onClick}>
			<Button
				variant='secondary'
				className='py-2 px-5 rounded-lg justify-between'
				onClick={() => setOpen((prev) => !prev)}
				type='button'>
				{t('blogPage.pinPosts.pin')}
				<ChevronDown
					className={cn(
						'transition-transform',
						isOpen && 'rotate-180'
					)}
				/>
			</Button>
		</Dropdown>
	);
};
