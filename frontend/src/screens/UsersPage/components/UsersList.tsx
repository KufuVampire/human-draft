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
			className='grid grid-cols-1 md:grid-cols-2 w-full gap-4 transition-colors'
			onClickCapture={onClickCapture}>
			{users.map(({ id, username, description, avatarUrl }) => (
				<li
					key={id}
					className='w-full bg-surface-card border border-border-subtle hover:border-primary/50 rounded-2xl shadow-xs hover:shadow-md transition-all p-4 group'>
					<CustomLink
						href={routesConfig.profileUsername(username)}
						className='flex w-full gap-x-4 text-left'>
						<UserAvatar
							username={username}
							avatarUrl={avatarUrl}
							location='users-page'
						/>
						<div className='flex flex-col gap-y-1.5 w-full min-w-0'>
							<h2 className='font-title font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight truncate'>
								{username}
							</h2>
							{description && (
								<p className='text-xs text-muted leading-relaxed truncate w-full'>
									{description}
								</p>
							)}
							<div className='pt-1'>
								<SubscribeUnsubscribeButtons
									toId={id}
									className='self-start py-1.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider'
									isSubscribed={subscriptions.includes(id)}
								/>
							</div>
						</div>
					</CustomLink>
				</li>
			))}
		</ul>
	);
};
