'use client';

import { useTranslations } from 'next-intl';

import { routesConfig } from '@/config';
import { SubscribeUnsubscribeButtons } from '@/modules';
import { CustomLink, UserAvatar } from '@/shared';

interface Props {
	isOwner: boolean;
	username: string;
	avatarUrl?: string | null;
	description?: string | null;
	ownerUsername?: string;
	userId: string;
	isSubscribed: boolean;
}

export const ProfileUserInfo = ({
	isOwner,
	username,
	avatarUrl,
	description,
	ownerUsername,
	userId,
	isSubscribed,
}: Props) => {
	const t = useTranslations();

	return (
		<div className='flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 p-6 min-h-28 transition-colors'>
			<div className='flex flex-col lg:flex-row items-center lg:items-start gap-4'>
				<UserAvatar
					username={username}
					avatarUrl={avatarUrl}
					location='profile-page'
				/>
				<div className='flex flex-col gap-y-1.5 items-center lg:items-start text-center lg:text-left'>
					<h1 className='font-title font-bold text-2xl md:text-3xl leading-tight text-foreground'>
						{username}
					</h1>
					{description && (
						<p className='text-sm text-muted leading-relaxed max-w-xl'>
							{description}
						</p>
					)}
				</div>
			</div>
			{isOwner && ownerUsername && (
				<CustomLink
					href={routesConfig.profileSettings(ownerUsername)}
					variant='secondary'
					className='py-2 px-4 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shrink-0'>
					{t('navigation.settings')}
				</CustomLink>
			)}
			{!isOwner && (
				<SubscribeUnsubscribeButtons
					toId={userId}
					className='py-2 px-4 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-xs transition-all shrink-0'
					isSubscribed={isSubscribed}
				/>
			)}
		</div>
	);
};
