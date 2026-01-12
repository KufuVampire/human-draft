'use client';

import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { routesConfig } from '@/config';
import { useGetUserByUsernameQuery } from '@/graphql/generated/output';
import { useProfilePoster } from '@/hooks';
import { Button, CustomLink, Section } from '@/shared';
import { useProfile } from '@/store';

interface Props {
	username: string;
}

export const ProfilePage = ({ username }: Props) => {
	const { profile } = useProfile();
	const t = useTranslations();
	const {
		changePosterLoading,
		removePosterLoading,
		poster,
		handleLoadPoster,
		handleRemovePoster,
	} = useProfilePoster();
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
			<Section className='flex flex-col w-full md:py-0 bg-[var(--background-color-card)] rounded-xl overflow-hidden'>
				<div className='min-h-[15.625rem] max-h-[15.625rem] bg-placeholder relative'>
					{!isOwner && user?.posterUrl && !poster && (
						<Image
							src={`${user.posterUrl}?t=${new Date().getTime()}`}
							alt='poster'
							fill
							sizes='100%'
							className='object-cover'
							priority
						/>
					)}
					{isOwner && profile?.posterUrl && !poster && (
						<Image
							src={`${profile.posterUrl}?t=${new Date().getTime()}`}
							alt='poster'
							fill
							sizes='100%'
							className='object-cover'
							priority
						/>
					)}
					{poster && (
						<Image
							src={URL.createObjectURL(poster)}
							alt='poster'
							fill
							sizes='100%'
							className='object-cover'
						/>
					)}
					<div className='flex justify-between absolute top-0 left-0 right-0 w-full py-3 px-6'>
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
						{isOwner && (profile?.posterUrl || poster) && (
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
				<div className='flex justify-between px-6 py-3 min-h-[7.188rem]'>
					<div className='flex gap-x-[1.125rem]'>
						<div className='size-[9.375rem] p-[0.313rem] rounded-full -mt-[5.5rem] bg-[var(--background-color-card)] z-30'>
							{user?.avatarUrl ? (
								<Image
									src={user.avatarUrl}
									alt={`${user.username} avatar`}
									width={140}
									height={140}
								/>
							) : (
								<div className='uppercase size-[8.75rem] flex items-center justify-center bg-[#dc5c4b] text-secondary rounded-full text-7xl cursor-default'>
									{user?.username.at(0)}
								</div>
							)}
						</div>
						<div className='flex flex-col gap-y-2'>
							<h1 className='font-title font-bold text-4xl leading-[110%]'>
								{user?.username}
							</h1>
							<p className='leading-6'>{user?.description}</p>
						</div>
					</div>
					{isOwner ? (
						<CustomLink
							href={routesConfig.settings}
							variant='secondary'
							className='py-2 px-3 font-bold leading-6 self-start rounded-lg dark:text-secondary'>
							{t('navigation.settings')}
						</CustomLink>
					) : (
						<Button className='self-start'>{t('btns.subscribe')}</Button>
					)}
				</div>
			</Section>
		</>
	);
};
