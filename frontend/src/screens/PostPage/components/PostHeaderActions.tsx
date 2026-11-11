'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type MouseEvent, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { routesConfig } from '@/config';
import { useGetBlogsForPinQuery } from '@/graphql/generated/output';
import { useDebounce } from '@/hooks';
import type { TypeSearchSchema } from '@/schemas';
import { Button, CustomLink, Dropdown, FormField } from '@/shared';
import { cn } from '@/utils';

interface Props {
	postId: string;
	pinnedBlogId: string | null;
	onTogglePinBlog: (blogId: string) => void;
	onDeletePost: () => void;
}

export const PostHeaderActions = ({
	postId,
	pinnedBlogId,
	onTogglePinBlog,
	onDeletePost,
}: Props) => {
	const t = useTranslations();
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const { register, watch } = useForm<TypeSearchSchema>({
		defaultValues: {
			search: '',
		},
	});

	const { data } = useGetBlogsForPinQuery({
		skip: !isDropdownOpen,
	});

	const searchStr = useDebounce(watch('search'));

	const drodownSearchField = useMemo(
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
					defaultChecked={id === pinnedBlogId}
				/>
			));
	}, [data, pinnedBlogId, searchStr]);

	const allDropdownItems = useMemo(
		() => [drodownSearchField, ...dropdownItems],
		[drodownSearchField, dropdownItems]
	);

	const handleDropdownClick = useCallback(
		(e: MouseEvent<HTMLUListElement>) => {
			const target = e.target as HTMLElement;
			const radio = target.closest('input');
			if (!radio) return;

			const blogId = radio.dataset.blog;
			if (!blogId) return;

			onTogglePinBlog(blogId);
		},
		[onTogglePinBlog]
	);

	return (
		<div className='flex flex-wrap sm:flex-nowrap items-center gap-2'>
			<Dropdown
				isOpen={isDropdownOpen}
				items={allDropdownItems}
				setOpen={setDropdownOpen}
				className='w-full sm:w-auto'
				listClassName='w-64 overflow-hidden py-3 px-2.5 shadow-secondary'
				onClick={handleDropdownClick}
				displayDirection='bottom'>
				<Button
					variant='secondary'
					className='bg-surface-card px-5 py-2 flex gap-x-5 rounded-lg w-full text-nowrap'
					onClick={() => setDropdownOpen((prev) => !prev)}>
					<span className='w-full inline-block text-left'>
						{t('postPage.pinBlog.pin')}
					</span>
					<ChevronDown
						className={cn(
							'transition-transform shrink-0',
							isDropdownOpen && 'rotate-180'
						)}
					/>
				</Button>
			</Dropdown>

			<Button
				variant='secondary'
				className='py-1.75 px-3 font-title font-bold leading-body rounded-lg flex-1 sm:flex-none'
				onClick={onDeletePost}>
				{t('btns.remove')}
			</Button>

			<CustomLink
				variant='primary'
				href={routesConfig.postUpdate(postId)}
				className='py-2 px-3 font-title font-bold leading-body rounded-lg text-nowrap flex-1 sm:flex-none'>
				{t('postPage.editPost')}
			</CustomLink>
		</div>
	);
};
