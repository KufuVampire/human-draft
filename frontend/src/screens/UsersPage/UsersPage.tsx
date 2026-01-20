'use client';

import { MouseEvent } from 'react';

import { useGetAllUsersQuery } from '@/graphql/generated/output';
import { useProfile } from '@/hooks';
import { SubscribeUnsubscribeButtons } from '@/modules';
import { CustomLink, Section, UserAvatar } from '@/shared';

export const UsersPage = () => {
	const { data } = useGetAllUsersQuery();
	const { profile, subscriptions } = useProfile();

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
	return (
		<Section className='w-full bg-[var(--background-color-card)] px-2 md:px-0 md:p-6 rounded-xl transition-colors'>
			<ul
				className='grid grid-cols-1 md:grid-cols-2 w-full gap-y-4 md:gap-6'
				onClickCapture={handleClick}>
				{users &&
					users.map(
						({ id, username, description, avatarUrl }) =>
							profile?.username !== username && (
								<li
									key={id}
									className='w-full border border-primary rounded-xl hover:shadow-primary transition-shadow'>
									<CustomLink
										href={username}
										className='flex w-full p-2 gap-x-4'>
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
							)
					)}
			</ul>
		</Section>
	);
};
