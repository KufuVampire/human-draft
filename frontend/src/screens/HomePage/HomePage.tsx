'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { HomePageFiltersDropdown } from './components/HomePageFiltersDropdown';
import { HomePageSearchBar } from './components/HomePageSearchBar';
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
	PostsAndBlogsList,
	Section,
} from '@/shared';
import { useProfileStore } from '@/store';

const perPage = SEARCH_PARAMS.PER_PAGE;

export const HomePage = () => {
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
		<div className='flex flex-col flex-1 min-w-0 gap-y-6'>
			<Section className='w-full md:py-0 flex gap-x-4 items-center relative'>
				<HomePageSearchBar
					search={search}
					register={register}
					dropdownSearchItems={dropdownSearchItems}
					isDropdownSearchOpen={isDropdownSearchOpen}
					setDropdownSearchOpen={setDropdownSearchOpen}
					isSearchOpenOnMobile={isSearchOpenOnMobile}
					setSearchOpenOnMobile={setSearchOpenOnMobile}
				/>
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
