'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEvent, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { SEARCH_PARAMS } from '@/consts';
import { useGetAllUsersQuery } from '@/graphql/generated/output';
import { useDebounce, useProfile } from '@/hooks';
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
import { cn } from '@/utils';

const arr = new Array(10).fill(0);

export const UsersPage = () => {
	const t = useTranslations();
	const [page] = useState<number>(SEARCH_PARAMS.PAGE);
	const [perPage] = useState<number>(SEARCH_PARAMS.PER_PAGE);
	const { subscriptions } = useProfile();
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
		skip: !debouncedSearchValue && !subscriptions.length,
	});

	const handleClick = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const button = target.closest('button');
		const a = target.closest('a');

		if (a && button) {
			e.preventDefault();
			return;
		}
	};

	const users = data?.getAllUsersPagination.data;

	const filteredUsers = useMemo(() => {
		const onlySubscribersUsers = users?.filter(
			(u) => onlySubscriptionsValue && subscriptions.includes(u.id)
		);
		if (onlySubscriptionsValue) {
			return onlySubscribersUsers;
		}

		return users;
	}, [onlySubscriptionsValue, subscriptions, users]);

	return (
		<Section className='w-full flex flex-col gap-y-6 px-2 md:px-0 md:p-6 rounded-xl md:p-0'>
			<div className='flex gap-x-6'>
				<FormField
					className='w-full p-0 border-none [&:not(:placeholder-shown)]:border-none [&:not(:placeholder-shown)]:shadow-none leading-[110%]'
					wrapperClassNames='w-full'
					inputWrapperClassName='bg-[var(--background-color-card)] transition-colors py-4 px-5 flex gap-x-2 md:gap-x-5 rounded-lg'
					placeholder={t('fields.searchByName')}
					{...register('search')}>
					<Search />
				</FormField>
				<FormField
					type='checkbox'
					wrapperClassNames='bg-[var(--background-color-card)] py-3 px-5 rounded-xl text-xl leading-[110%]'
					text={t('filters.subscriptions')}
					checked={onlySubscriptionsValue}
					{...register('onlySubscriptions')}
				/>
			</div>
			{!loading && filteredUsers && filteredUsers.length > 0 && (
				<ul
					className={cn(
						'grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 md:gap-6 bg-[var(--background-color-card)] px-5 py-4 rounded-xl transition-colors',
						users && users.length < 1 && 'hidden'
					)}
					onClickCapture={handleClick}>
					{filteredUsers?.map(({ id, username, description, avatarUrl }) => (
						<li
							key={id}
							className='w-full border border-primary rounded-xl hover:shadow-primary transition-shadow'>
							<CustomLink
								href={username}
								className='flex w-full p-2 gap-x-4 text-left hover:text-[var(--text-color-main)] focus-visible:text-[var(--text-color-main)]'>
								<UserAvatar
									username={username}
									avatarUrl={avatarUrl}
									location='users-page'
								/>
								<div className='flex flex-col gap-y-2 w-full min-w-0'>
									<h2 className='font-title font-bold text-xl leading-[110%]'>
										{username}
									</h2>
									<p className='leading-6 truncate w-full'>{description}</p>
									<SubscribeUnsubscribeButtons
										toId={id}
										className='self-start py-1 px-2 rounded-sm leading-[110%] tracking-[5%] uppercase'
										isSubscribed={subscriptions.includes(id)}
									/>
								</div>
							</CustomLink>
						</li>
					))}
				</ul>
			)}
			{loading && (
				<ul className='grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 md:gap-6 bg-[var(--background-color-card)] px-5 py-4 rounded-xl transition-colors'>
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
		</Section>
	);
};
