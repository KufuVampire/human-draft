'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { routesConfig } from '@/config';
import { SEARCH_PARAMS } from '@/consts';
import {
	useDebounce,
	useInfiniteScroll,
	usePostsAndBlogs,
	usePostsAndBlogsSearch,
	useProfile,
} from '@/hooks';
import { TypeHomePageSearchSchema } from '@/schemas';
import {
	Button,
	CreatePostBlogLinks,
	CustomLink,
	Dropdown,
	FormField,
	PostsAndBlogsList,
	Section,
	TagsList,
	UserBadgeWithCreatedAt,
} from '@/shared';
import { cn } from '@/utils';

interface IFilter {
	key: keyof TypeHomePageSearchSchema;
	translationKey: string;
	needAuth: boolean;
}

const filters: IFilter[] = [
	{
		key: 'onlyPosts',
		translationKey: 'filters.posts',
		needAuth: false,
	},
	{
		key: 'onlyBlogs',
		translationKey: 'filters.blogs',
		needAuth: false,
	},
	{
		key: 'onlySubscriptions',
		translationKey: 'filters.subscriptions',
		needAuth: true,
	},
];

const perPage = SEARCH_PARAMS.PER_PAGE;

const searchedItemStyles = 'items-start px-5 py-3 flex-col gap-y-2 group';

export const HomePage = () => {
	const t = useTranslations();
	const { isAuth } = useProfile();
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
	const [isFiltersOpen, setFiltersOpen] = useState(false);
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

	const filterItems = useMemo(() => {
		return filters.map(({ key, needAuth, translationKey }) => {
			if (needAuth && !isAuth) return;

			if (needAuth && isAuth) {
				return (
					<FormField
						key={key}
						text={t(translationKey)}
						type='checkbox'
						{...register(key)}
					/>
				);
			}

			return (
				<FormField
					key={key}
					text={t(translationKey)}
					type='checkbox'
					{...register(key)}
				/>
			);
		});
	}, [isAuth, register, t]);
	const dropdownSearchItems = useMemo(() => {
		return searchedItems.map((o) => {
			if (o.__typename === 'BlogModel') {
				return (
					<CustomLink
						key={o.id}
						href={routesConfig.blogById(o.id)}
						className={searchedItemStyles}>
						<h2 className='font-title text-left text-xl leading-[150%]'>
							{o.title}
						</h2>
						<UserBadgeWithCreatedAt
							author={o.author}
							createdAt={o.createdAt}
							type='not-link'
						/>
						<TagsList tags={o.tags} />
					</CustomLink>
				);
			}

			if (o.__typename === 'PostModel') {
				return (
					<CustomLink
						key={o.id}
						href={routesConfig.postById(o.id)}
						className={searchedItemStyles}>
						<h2 className='font-title text-left text-xl leading-[150%]'>
							{o.title}
						</h2>
						<UserBadgeWithCreatedAt
							author={o.author}
							createdAt={o.createdAt}
							type='not-link'
						/>
						<TagsList tags={o.tags} />
					</CustomLink>
				);
			}
		});
	}, [searchedItems]);

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
						className='w-full p-0 border-none [&:not(:placeholder-shown)]:border-none [&:not(:placeholder-shown)]:shadow-none leading-[110%]'
						wrapperClassNames='w-full shadow rounded-[0.625rem]'
						inputWrapperClassName='bg-[var(--background-color-card)] transition-colors py-4 px-5 flex gap-x-2 md:gap-x-5 rounded-lg'
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
				<Dropdown
					isOpen={isFiltersOpen}
					setOpen={setFiltersOpen}
					items={filterItems} listClassName='w-full'>
					<Button
						variant='clear'
						className='flex gap-x-5 items-center bg-[var(--background-color-card)] px-5 py-4 rounded-[0.625rem] text-xl leading-[110%] shadow'
						onClick={() => setFiltersOpen((prev) => !prev)}>
						<SlidersHorizontal />
						{t('homePage.filters')}
					</Button>
				</Dropdown>
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
