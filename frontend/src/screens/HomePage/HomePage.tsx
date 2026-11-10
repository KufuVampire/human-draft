'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { HomePageFiltersDropdown } from './components/HomePageFiltersDropdown';
import { renderSearchItems } from './components/HomePageSearchItems';
import { SEARCH_PARAMS } from '@/consts';
import {
	useDebounce,
	useInfiniteScroll,
	usePostsAndBlogs,
	usePostsAndBlogsSearch,
} from '@/hooks';
import { TypeHomePageSearchSchema } from '@/schemas';
import {
	CreatePostBlogLinks,
	Dropdown,
	FormField,
	PostsAndBlogsList,
	Section,
} from '@/shared';
import { useProfileStore } from '@/store';
import { cn } from '@/utils';

const perPage = SEARCH_PARAMS.PER_PAGE;

export const HomePage = () => {
	const t = useTranslations();
	const isAuth = useProfileStore((s) => s.isAuth);
	const [page, setPage] = useState(SEARCH_PARAMS.PAGE);
	const { register, watch } = useForm<TypeHomePageSearchSchema>({
		defaultValues: {
			search: '',
			onlySubscriptions: false,
			onlyBlogs: false,
			onlyPosts: false,
		},
		mode: 'onChange',
	});
	const [isDropdownSearchOpen, setDropdownSearchOpen] = useState(false);
	const [isSearchOpenOnMobile, setSearchOpenOnMobile] = useState(false);

	const search = useDebounce(watch('search'));
	const onlySubscriptions = useDebounce(watch('onlySubscriptions'));
	const onlyBlogs = useDebounce(watch('onlyBlogs'));
	const onlyPosts = useDebounce(watch('onlyPosts'));

	const params = useMemo(
		() => ({
			page,
			perPage,
			filters: {
				onlyBlogs,
				onlyPosts,
				onlySubscriptions,
			},
		}),
		[page, onlyBlogs, onlyPosts, onlySubscriptions]
	);
	const dropdownSearchParams = useMemo(
		() => ({
			page,
			perPage,
			search,
		}),
		[page, search]
	);

	const { postsAndBlogs, hasMore, isLoading } = usePostsAndBlogs({
		...params,
	});
	const { postsAndBlogs: searchedItems } = usePostsAndBlogsSearch({
		...dropdownSearchParams,
	});
	const lastElementRef = useInfiniteScroll({
		onLoadMore: () => setPage((prev) => prev + 1),
		hasMore,
		isLoading,
	});

	const dropdownSearchItems = useMemo(
		() => renderSearchItems(searchedItems),
		[searchedItems]
	);

	useEffect(() => {
		setPage(SEARCH_PARAMS.PAGE);
	}, [search, onlySubscriptions, onlyBlogs, onlyPosts]);

	useEffect(() => {
		if (search.length >= 3 && dropdownSearchItems.length > 0) {
			setDropdownSearchOpen(true);
		} else {
			setDropdownSearchOpen(false);
		}
	}, [dropdownSearchItems, search]);

	return (
		<div className='flex flex-col w-full gap-y-6'>
			<Section className='w-full md:py-0 flex gap-x-6 relative'>
				<Dropdown
					isOpen={isDropdownSearchOpen}
					setOpen={(value) => {
						const next =
							typeof value === 'function' ? value(isDropdownSearchOpen) : value;

						setDropdownSearchOpen(next);

						if (!next) {
							setSearchOpenOnMobile(false);
						}
					}}
					className={cn(
						'w-full',
						isSearchOpenOnMobile && 'absolute top-3 z-10 sm:static'
					)}
					listClassName='w-full shadow-primary'
					itemClassName='border-b border-placeholder last:border-b-0'
					items={dropdownSearchItems}>
					<FormField
						className='w-full p-0 border-none [&:not(:placeholder-shown)]:border-none [&:not(:placeholder-shown)]:shadow-none leading-heading-tight'
						wrapperClassNames='w-full shadow rounded-card'
						inputWrapperClassName='bg-surface-card transition-colors py-4 px-5 flex gap-x-2 md:gap-x-5 rounded-lg'
						placeholder={t('fields.searchInput')}
						{...register('search')}
						onFocus={() => {
							if (search.length >= 3 && dropdownSearchItems.length > 0) {
								setDropdownSearchOpen(true);
							}

							setSearchOpenOnMobile(true);
						}}>
						<Search />
					</FormField>
				</Dropdown>
				<HomePageFiltersDropdown
					isAuth={isAuth}
					register={register}
				/>
			</Section>
			<Section className='w-full md:py-0 flex flex-col gap-y-6'>
				{isAuth && <CreatePostBlogLinks />}
				{postsAndBlogs.length > 0 && (
					<>
						<PostsAndBlogsList data={postsAndBlogs} />
						<div ref={lastElementRef} />
					</>
				)}
			</Section>
		</div>
	);
};
