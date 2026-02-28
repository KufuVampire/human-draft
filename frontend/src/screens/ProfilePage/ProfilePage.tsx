'use client';

import { EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { MouseEvent, useMemo, useState } from 'react';

import { ProfilePoster } from './ProfilePoster/ProfilePoster';
import { routesConfig } from '@/config';
import { useGetUserByUsernameQuery } from '@/graphql/generated/output';
import { useProfile } from '@/hooks';
import { SubscribeUnsubscribeButtons } from '@/modules';
import {
	Button,
	CreatePostBlogLinks,
	CustomLink,
	Dropdown,
	PostsAndBlogsList,
	ProfilePageSkeleton,
	Section,
	UserAvatar,
} from '@/shared';

interface Props {
	username: string;
}

export const ProfilePage = ({ username }: Props) => {
	const [isOpen, setOpen] = useState(false);
	const {
		profile,
		subscriptions,
		changePosterLoading,
		removePosterLoading,
		isAvatarChanging,
		isAvatarRemoving,
		handleLoadPoster,
		handleRemovePoster,
		handleRemoveAvatar,
		handleChangeAvatar,
	} = useProfile();
	const t = useTranslations();

	const isOwner = profile?.username === username;

	const { data, loading } = useGetUserByUsernameQuery({
		variables: { username },
	});

	const dropdownList = useMemo(() => {
		const inputs = [
			<label
				key={'edit-avatar'}
				className='text-secondary px-3 rounded-lg leading-6 backdrop-blur-disabled hover:text-primary-hover focus-visible:text-primary-hover cursor-pointer transition-colors w-full text-left'>
				{t('btns.editAvatar')}
				<input
					type='file'
					className='hidden'
					onChange={handleChangeAvatar}
					disabled={
						removePosterLoading ||
						changePosterLoading ||
						isAvatarChanging ||
						isAvatarRemoving
					}
				/>
			</label>,
			<label
				key={'edit-poster'}
				className='text-secondary px-3 rounded-lg leading-6 backdrop-blur-disabled hover:text-primary-hover focus-visible:text-primary-hover cursor-pointer transition-colors w-full text-left'>
				{t('btns.editPoster')}
				<input
					type='file'
					className='hidden'
					onChange={handleLoadPoster}
					disabled={
						removePosterLoading ||
						changePosterLoading ||
						isAvatarChanging ||
						isAvatarRemoving
					}
				/>
			</label>,
		];

		if (profile?.avatarUrl && !profile?.posterUrl) {
			return [
				...inputs,
				<Button
					disabled={
						removePosterLoading ||
						changePosterLoading ||
						isAvatarChanging ||
						isAvatarRemoving
					}
					key={'remove-avatar'}
					variant='clear'
					data-variant={'remove-avatar'}
					className='rounded-lg px-3 w-full text-left block'>
					{t('btns.removeAvatar')}
				</Button>,
			];
		}

		if (!profile?.avatarUrl && profile?.posterUrl) {
			return [
				...inputs,
				<Button
					disabled={
						removePosterLoading ||
						changePosterLoading ||
						isAvatarChanging ||
						isAvatarRemoving
					}
					key={'remove-poster'}
					variant='clear'
					data-variant={'remove-poster'}
					className='rounded-lg px-3 w-full text-left block'>
					{t('btns.removePoster')}
				</Button>,
			];
		}

		if (profile?.posterUrl && profile.avatarUrl) {
			return [
				...inputs,
				<Button
					disabled={
						removePosterLoading ||
						changePosterLoading ||
						isAvatarChanging ||
						isAvatarRemoving
					}
					key={'remove-avatar'}
					variant='clear'
					data-variant={'remove-avatar'}
					className='rounded-lg px-3 w-full text-left block'>
					{t('btns.removeAvatar')}
				</Button>,
				<Button
					disabled={
						removePosterLoading ||
						changePosterLoading ||
						isAvatarChanging ||
						isAvatarRemoving
					}
					key={'remove-poster'}
					variant='clear'
					data-variant={'remove-poster'}
					className='rounded-lg px-3 w-full text-left block'>
					{t('btns.removePoster')}
				</Button>,
			];
		}

		return inputs;
	}, [
		changePosterLoading,
		isAvatarChanging,
		isAvatarRemoving,
		profile,
		removePosterLoading,
		t,
	]);

	const handleClick = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const button = target.closest('button');

		if (!button) return;

		const variant = button.dataset.variant;
		switch (variant) {
			case 'remove-avatar':
				handleRemoveAvatar();
				break;
			case 'remove-poster':
				handleRemovePoster();
				break;
		}
	};

	if (loading) {
		return <ProfilePageSkeleton isOwner={isOwner} />;
	}

	if (!loading && !data) {
		redirect(routesConfig.notFound);
	}

	const user = data?.getUserByUsername;

	if (!user) {
		redirect(routesConfig.notFound);
	}

	const userBlogsAndPosts = [...user.posts, ...user.blogs];
	const sortedUserBlogsAndPosts = userBlogsAndPosts
		.slice()
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

	return (
		<div className='flex flex-col w-full gap-y-6'>
			<Section className='flex flex-col w-full py-0 md:py-0 bg-[var(--background-color-card)] rounded-xl overflow-hidden transition-colors'>
				<ProfilePoster
					isOwner={isOwner}
					user={{ posterUrl: user.posterUrl }}>
					{isOwner && (
						<div className='flex justify-end absolute top-0 left-0 right-0 w-full p-2 md:py-3 md:px-6'>
							<Dropdown
								isOpen={isOpen}
								setOpen={setOpen}
								items={dropdownList}
								listClassName='bg-disabled py-2 gap-y-2.5'
								displayDirection='top-right'
								onClick={handleClick}>
								<Button
									variant='light'
									className='rounded-lg py-2 px-3 group'
									onClick={() => setOpen((prev) => !prev)}
									title={t('btns.aria.profilePage.dropdown')}>
									<EllipsisVertical className='stroke-secondary group-hover:stroke-primary-hover transition-colors' />
								</Button>
							</Dropdown>
						</div>
					)}
				</ProfilePoster>
				<div className='flex lg:flex-row flex-col items-center gap-y-2 lg:items-stretch justify-between px-6 pb-6 md:py-3 min-h-[7.188rem]'>
					<div className='flex lg:flex-row flex-col items-center lg:items-stretch gap-x-3 gap-y-2'>
						{isOwner && (
							<UserAvatar
								username={profile?.username}
								avatarUrl={profile?.avatarUrl}
								location='profile-page'
							/>
						)}
						{!isOwner && (
							<UserAvatar
								username={user.username}
								avatarUrl={user.avatarUrl}
								location='profile-page'
							/>
						)}
						<div className='flex flex-col gap-y-2 items-center lg:items-stretch'>
							<h1 className='font-title font-bold text-4xl leading-[110%] text-center lg:text-left'>
								{user.username}
							</h1>
							{user.description && (
								<p className='leading-6 text-center lg:text-left'>
									{user.description}
								</p>
							)}
						</div>
					</div>
					{isOwner && profile && (
						<CustomLink
							href={routesConfig.profileSettings(profile.username)}
							variant='secondary'
							className='py-2 px-3 font-bold leading-6 lg:self-start rounded-lg dark:text-secondary text-center self-center'>
							{t('navigation.settings')}
						</CustomLink>
					)}
					{!isOwner && (
						<SubscribeUnsubscribeButtons
							toId={user.id}
							className='py-2 px-3 font-bold leading-6 lg:self-start rounded-lg self-center'
							isSubscribed={subscriptions.includes(user.id)}
						/>
					)}
				</div>
			</Section>
			<CreatePostBlogLinks />
			{sortedUserBlogsAndPosts.length > 0 && (
				<PostsAndBlogsList data={sortedUserBlogsAndPosts} />
			)}
		</div>
	);
};
