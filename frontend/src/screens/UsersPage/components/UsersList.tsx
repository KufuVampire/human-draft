'use client';

import type { MouseEvent } from 'react';

import { routesConfig } from '@/config';
import type { GetAllUsersQuery } from '@/graphql/generated/output';
import { SubscribeUnsubscribeButtons } from '@/modules';
import { CustomLink, UserAvatar } from '@/shared';

type UserItem = GetAllUsersQuery['getAllUsersPagination']['data'][number];

interface Props {
	users: UserItem[];
	subscriptions: string[];
	onClickCapture: (e: MouseEvent<HTMLUListElement>) => void;
}

export const UsersList = ({ users, subscriptions, onClickCapture }: Props) => {
	return (
		<ul
			className='grid grid-cols-1 lg:grid-cols-2 w-full gap-y-4 md:gap-6 bg-surface-card px-5 py-4 rounded-xl transition-colors'
			onClickCapture={onClickCapture}>
			{users.map(({ id, username, description, avatarUrl }) => (
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
	);
};
