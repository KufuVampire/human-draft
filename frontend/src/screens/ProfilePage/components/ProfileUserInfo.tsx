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
		<div className='flex lg:flex-row flex-col items-center gap-y-2 lg:items-stretch justify-between px-6 pb-6 md:py-3 min-h-[7.188rem]'>
			<div className='flex lg:flex-row flex-col items-center lg:items-stretch gap-x-3 gap-y-2'>
				<UserAvatar
					username={username}
					avatarUrl={avatarUrl}
					location='profile-page'
				/>
				<div className='flex flex-col gap-y-2 items-center lg:items-stretch'>
					<h1 className='font-title font-bold text-4xl leading-heading-tight text-center lg:text-left'>
						{username}
					</h1>
					{description && (
						<p className='leading-6 text-center lg:text-left'>
							{description}
						</p>
					)}
				</div>
			</div>
			{isOwner && ownerUsername && (
				<CustomLink
					href={routesConfig.profileSettings(ownerUsername)}
					variant='secondary'
					className='py-2 px-3 font-bold leading-6 lg:self-start rounded-lg dark:text-secondary text-center self-center'>
					{t('navigation.settings')}
				</CustomLink>
			)}
			{!isOwner && (
				<SubscribeUnsubscribeButtons
					toId={userId}
					className='py-2 px-3 font-bold leading-6 lg:self-start rounded-lg self-center'
					isSubscribed={isSubscribed}
				/>
			)}
		</div>
	);
};
