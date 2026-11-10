'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { UsersList } from './components/UsersList';
import { UsersSkeletonList } from './components/UsersSkeletonList';
import { SEARCH_PARAMS } from '@/consts';
import {
	GetAllUsersQuery,
	useGetAllUsersQuery,
} from '@/graphql/generated/output';
import { useDebounce, useInfiniteScroll } from '@/hooks';
import { TypeUsersSearchSchema } from '@/schemas';
import { FormField, Section } from '@/shared';
import { useSubscriptions } from '@/store';

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

	useEffect(() => {
		setPage(SEARCH_PARAMS.PAGE);
	}, [debouncedSearchValue, onlySubscriptionsValue]);

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
		<Section className='w-full flex flex-col gap-y-6 px-2 md:px-0 rounded-xl md:p-0'>
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
				<UsersList
					users={filteredUsers}
					subscriptions={subscriptions}
					onClickCapture={handleClick}
				/>
			)}

			{hasMore && <div ref={lastElementRef} className='h-4 w-full' />}

			{loading && page === 1 && <UsersSkeletonList count={10} />}
			{loading && page > 1 && <UsersSkeletonList count={2} prefix='more' />}
		</Section>
	);
};
