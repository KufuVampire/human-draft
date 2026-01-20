'use client';

import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { routesConfig } from '@/config';
import { useGetUserByUsernameQuery } from '@/graphql/generated/output';
import { useProfile } from '@/hooks';
import { SubscribeUnsubscribeButtons } from '@/modules';
import { Button, CustomLink, Section, UserAvatar } from '@/shared';

interface Props {
	username: string;
}

export const ProfilePage = ({ username }: Props) => {
	const {
		profile,
		subscriptions,
		changePosterLoading,
		removePosterLoading,
		poster,
		handleLoadPoster,
		handleRemovePoster,
	} = useProfile();
	const t = useTranslations();

	const { data, loading } = useGetUserByUsernameQuery({
		variables: { username },
	});

	if (!data && !loading) {
		redirect(routesConfig.notFound);
	}

	const user = data?.getUserByUsername;
	const isOwner = profile?.username === user?.username;

	return (
		<>
			<Section className='flex flex-col w-full py-0 md:py-0 bg-[var(--background-color-card)] rounded-xl overflow-hidden transition-colors'>
				<div className='min-h-[12.5rem] md:min-h-[15.625rem] max-h-[12.5rem] md:max-h-[15.625rem] bg-placeholder relative'>
					{!isOwner && user?.posterUrl && (
						<Image
							src={`${user.posterUrl}?t=${new Date().getTime()}`}
							alt='poster'
							fill
							sizes='100%'
							className='object-cover'
							priority
						/>
					)}
					{isOwner && poster && (
						<Image
							src={
								poster instanceof File
									? URL.createObjectURL(poster)
									: `${poster}?t=${new Date().getTime()}`
							}
							alt='poster'
							fill
							sizes='100%'
							className='object-cover'
							priority
						/>
					)}
					<div className='flex justify-between absolute top-0 left-0 right-0 w-full p-2 md:py-3 md:px-6'>
						{isOwner && (
							<label className='text-secondary py-2 px-3 rounded-lg font-bold leading-6 bg-disabled hover:bg-disabled backdrop-blur-disabled hover:text-primary-hover focus-visible:text-primary-hover cursor-pointer transition-colors'>
								{t('btns.editPoster')}
								<input
									type='file'
									className='hidden'
									onChange={handleLoadPoster}
									disabled={removePosterLoading || changePosterLoading}
								/>
							</label>
						)}
						{isOwner && poster && (
							<Button
								disabled={removePosterLoading || changePosterLoading}
								onClick={handleRemovePoster}
								variant='light'
								className='rounded-lg py-2 px-3 group'>
								<Trash className='stroke-secondary group-hover:stroke-primary-hover transition-colors' />
							</Button>
						)}
					</div>
				</div>
				<div className='flex md:flex-row flex-col items-center gap-y-2 md:items-stretch justify-between px-6 pb-6 md:py-3 min-h-[7.188rem]'>
					<div className='flex md:flex-row flex-col items-center md:items-stretch gap-x-[1.125rem] gap-y-2'>
						{user && <UserAvatar username={user.username} avatarUrl={user.avatarUrl} />}
						<div className='flex flex-col gap-y-2 items-center md:items-stretch'>
							<h1 className='font-title font-bold text-4xl leading-[110%]'>
								{user?.username}
							</h1>
							{user?.description && <p className='leading-6'>{user.description}</p>}
						</div>
					</div>
					{isOwner && profile && (
						<CustomLink
							href={`${profile.username}/${routesConfig.settings}`}
							variant='secondary'
							className='py-2 px-3 font-bold leading-6 md:self-start rounded-lg dark:text-secondary'>
							{t('navigation.settings')}
						</CustomLink>
					)}
					{!isOwner && user?.id && (
						<SubscribeUnsubscribeButtons
							toId={user.id}
							className='py-2 px-3 font-bold leading-6 md:self-start rounded-lg'
							isSubscribed={subscriptions.includes(user.id)}
						/>
					)}
				</div>
			</Section>
		</>
	);
};
