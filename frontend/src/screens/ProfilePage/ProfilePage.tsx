'use client';

import { notFound, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ProfileDropdown } from './components/ProfileDropdown';
import { ProfileUserInfo } from './components/ProfileUserInfo';
import { ProfilePoster } from './ProfilePoster/ProfilePoster';
import {
	GetUserByUsernameQuery,
	useGetUserByUsernameQuery,
} from '@/graphql/generated/output';
import { useProfile, useProfileAvatar, useProfilePoster } from '@/hooks';
import {
	CreatePostBlogLinks,
	PostsAndBlogsList,
	ProfilePageSkeleton,
	Section,
} from '@/shared';
import { isNotFoundError } from '@/utils';

interface Props {
	username: string;
	initialData?: GetUserByUsernameQuery['getUserByUsername'];
}

export const ProfilePage = ({ username, initialData }: Props) => {
	const router = useRouter();
	const { profile, subscriptions } = useProfile();
	const {
		changePosterLoading,
		removePosterLoading,
		handleLoadPoster,
		handleRemovePoster,
	} = useProfilePoster();
	const {
		isAvatarChanging,
		isAvatarRemoving,
		handleRemoveAvatar,
		handleChangeAvatar,
	} = useProfileAvatar();

	const isOwner = profile?.username === username;

	const { data, loading, error } = useGetUserByUsernameQuery({
		variables: { username },
		skip: !!initialData,
	});

	const user = data?.getUserByUsername ?? initialData;

	useEffect(() => {
		if (loading && !user) return;
		if (error) {
			if (isNotFoundError(error)) {
				notFound();
			}
			return;
		}
		if (!user) {
			notFound();
		}
	}, [loading, data, user, error, router]);

	if (error && !isNotFoundError(error)) {
		throw error;
	}

	if (loading && !user) {
		return <ProfilePageSkeleton isOwner={isOwner} />;
	}

	if (!user) {
		return null;
	}

	const userBlogsAndPosts = [...user.posts, ...user.blogs];
	const sortedUserBlogsAndPosts = userBlogsAndPosts
		.slice()
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

	const isMediaActionDisabled =
		removePosterLoading ||
		changePosterLoading ||
		isAvatarChanging ||
		isAvatarRemoving;

	return (
		<div className='flex flex-col w-full gap-y-6'>
			<Section className='flex flex-col w-full py-0 md:py-0 bg-surface-card rounded-xl overflow-hidden transition-colors'>
				<ProfilePoster
					isOwner={isOwner}
					user={{ posterUrl: user.posterUrl }}>
					{isOwner && (
						<ProfileDropdown
							hasAvatar={!!profile?.avatarUrl}
							hasPoster={!!profile?.posterUrl}
							isDisabled={isMediaActionDisabled}
							onChangeAvatar={handleChangeAvatar}
							onLoadPoster={handleLoadPoster}
							onRemoveAvatar={handleRemoveAvatar}
							onRemovePoster={handleRemovePoster}
						/>
					)}
				</ProfilePoster>
				<ProfileUserInfo
					isOwner={isOwner}
					username={isOwner ? (profile?.username ?? user.username) : user.username}
					avatarUrl={isOwner ? profile?.avatarUrl : user.avatarUrl}
					description={user.description}
					ownerUsername={profile?.username}
					userId={user.id}
					isSubscribed={subscriptions.includes(user.id)}
				/>
			</Section>
			{isOwner && <CreatePostBlogLinks />}
			{sortedUserBlogsAndPosts.length > 0 && (
				<PostsAndBlogsList data={sortedUserBlogsAndPosts} />
			)}
		</div>
	);
};
