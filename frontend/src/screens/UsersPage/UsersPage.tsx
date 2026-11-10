'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { routesConfig } from '@/config';
import { SEARCH_PARAMS } from '@/consts';
import {
	GetAllUsersQuery,
	useGetAllUsersQuery,
} from '@/graphql/generated/output';
import { useDebounce, useInfiniteScroll } from '@/hooks';
import { SubscribeUnsubscribeButtons } from '@/modules';
import { TypeUsersSearchSchema } from '@/schemas';
import {
	CustomLink,
	FormField,
	Section,
	Skeleton,
	UserAvatar,
	UserAvatarSkeleton,
} from '@/shared';
import { useSubscriptions } from '@/store';
import { cn } from '@/utils';

const initialSkeletonCount = 10;
const arr = new Array(initialSkeletonCount).fill(0);
const loadMoreArr = new Array(2).fill(0);

type UserItem = GetAllUsersQuery['getAllUsersPagination']['data'][number];

export const UsersPage = () => {
	const t = useTranslations();
	const [page, setPage] = useState<number>(SEARCH_PARAMS.PAGE);
	const perPage = SEARCH_PARAMS.PER_PAGE;
	const [allUsers, setAllUsers] = useState<UserItem[]>([]);
	const subscriptions = useSubscriptions((s) => s.subscriptions);
	const { register, watch } = useForm<TypeUsersSearchSchema>({
		defaultValues: {
			search: '',
			onlySubscriptions: false,
		},
	});

	const searchValue = watch('search').trim();
	const onlySubscriptionsValue = watch('onlySubscriptions');
	const debouncedSearchValue = useDebounce(searchValue);

	const { data, loading } = useGetAllUsersQuery({
		variables: {
			searchParams: {
				page,
				perPage,
			},
			searchStr: debouncedSearchValue,
			onlySubscriptions: onlySubscriptionsValue,
		},
	});

	// Reset page when filters or search change
	useEffect(() => {
		setPage(SEARCH_PARAMS.PAGE);
	}, [debouncedSearchValue, onlySubscriptionsValue]);

	// Accumulate users as pages are fetched
	useEffect(() => {
		if (loading || !data?.getAllUsersPagination) return;

		const newUsers = data.getAllUsersPagination.data;

		if (page === 1) {
			setAllUsers(newUsers);
		} else if (newUsers.length > 0) {
			setAllUsers((prev) => {
				const map = new Map<string, UserItem>();
				[...prev, ...newUsers].forEach((u) => {
					map.set(u.id, u);
				});
				return Array.from(map.values());
			});
		}
	}, [data, loading, page]);

	const totalPages = data?.getAllUsersPagination.totalPages ?? 0;
	const hasMore = page < totalPages;

	const lastElementRef = useInfiniteScroll({
		onLoadMore: () => setPage((prev) => prev + 1),
		hasMore,
		isLoading: loading,
	});

	const handleClick = useCallback((e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const button = target.closest('button');
		const a = target.closest('a');

		if (a && button) {
			e.preventDefault();
			return;
		}
	}, []);

	const filteredUsers = useMemo(() => {
		if (onlySubscriptionsValue) {
			return allUsers.filter((u) => subscriptions.includes(u.id));
		}

		return allUsers;
	}, [onlySubscriptionsValue, subscriptions, allUsers]);

	return (
		<Section className='w-full flex flex-col gap-y-6 px-2 md:px-0 md:p-6 rounded-xl md:p-0'>
			<div className='flex gap-x-6'>
				<FormField
					className='w-full p-0 border-none [&:not(:placeholder-shown)]:border-none [&:not(:placeholder-shown)]:shadow-none leading-heading-tight'
					wrapperClassNames='w-full'
					inputWrapperClassName='bg-surface-card transition-colors py-4 px-5 flex gap-x-2 md:gap-x-5 rounded-lg'
					placeholder={t('fields.searchByName')}
					{...register('search')}>
					<Search />
				</FormField>
				<FormField
					type='checkbox'
					wrapperClassNames='bg-surface-card py-3 px-5 rounded-xl text-xl leading-heading-tight'
					text={t('filters.subscriptions')}
					checked={onlySubscriptionsValue}
					{...register('onlySubscriptions')}
				/>
			</div>

			{filteredUsers.length > 0 && (
				<ul
					className='grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 md:gap-6 bg-surface-card px-5 py-4 rounded-xl transition-colors'
					onClickCapture={handleClick}>
					{filteredUsers.map(({ id, username, description, avatarUrl }) => (
						<li
							key={id}
							className='w-full border border-primary rounded-xl hover:shadow-primary transition-shadow'>
							<CustomLink
								href={routesConfig.profileUsername(username)}
								className='flex w-full p-2 gap-x-4 text-left hover:text-foreground focus-visible:text-foreground'>
								<UserAvatar
									username={username}
									avatarUrl={avatarUrl}
									location='users-page'
								/>
								<div className='flex flex-col gap-y-2 w-full min-w-0'>
									<h2 className='font-title font-bold text-xl leading-heading-tight'>
										{username}
									</h2>
									<p className='leading-6 truncate w-full'>{description}</p>
									<SubscribeUnsubscribeButtons
										toId={id}
										className='self-start py-1 px-2 rounded-sm leading-heading-tight tracking-wider uppercase'
										isSubscribed={subscriptions.includes(id)}
									/>
								</div>
							</CustomLink>
						</li>
					))}
				</ul>
			)}

			{hasMore && <div ref={lastElementRef} className='h-4 w-full' />}

			{loading && page === 1 && (
				<ul className='grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 md:gap-6 bg-surface-card px-5 py-4 rounded-xl transition-colors'>
					{arr.map((_, i) => (
						<li
							key={i}
							className='w-full border border-primary rounded-xl transition-shadow'>
							<div className='flex w-full p-2 gap-x-4'>
								<UserAvatarSkeleton location='users-page' />
								<div className='flex flex-col gap-y-2 w-full'>
									<Skeleton className='w-2/3 h-5.5 rounded-sm' />
									<Skeleton className='w-full h-6 rounded-sm' />
									<Skeleton className='self-start max-w-32 w-full h-6.5 rounded-sm' />
								</div>
							</div>
						</li>
					))}
				</ul>
			)}

			{loading && page > 1 && (
				<ul className='grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 md:gap-6 bg-surface-card px-5 py-4 rounded-xl transition-colors'>
					{loadMoreArr.map((_, i) => (
						<li
							key={`more-${i}`}
							className='w-full border border-primary rounded-xl transition-shadow'>
							<div className='flex w-full p-2 gap-x-4'>
								<UserAvatarSkeleton location='users-page' />
								<div className='flex flex-col gap-y-2 w-full'>
									<Skeleton className='w-2/3 h-5.5 rounded-sm' />
									<Skeleton className='w-full h-6 rounded-sm' />
									<Skeleton className='self-start max-w-32 w-full h-6.5 rounded-sm' />
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</Section>
	);
};
