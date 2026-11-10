'use client';

import { Eye, Heart, MessageSquare } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { useLocalStorage } from '@/hooks';
import { Button, TagsList } from '@/shared';
import { useComments, useModalStore, useProfileStore } from '@/store';
import { cn } from '@/utils';

const isLikeExpired = (date: number) => {
	if (!date) return true;
	const now = Date.now();
	return now - date >= 24 * 60 * 60 * 1000;
};

interface ILikedAt {
	postId: string;
	date: number;
	isLiked: boolean;
	userId: string | null;
}

interface Props {
	postId: string;
	tags?: { id: string; name: string }[] | null;
	likesCount?: number;
	viewsCount?: number;
}

export const PostStatsBar = ({
	postId,
	tags,
	likesCount,
	viewsCount,
}: Props) => {
	const profile = useProfileStore((s) => s.profile);
	const isAuth = useProfileStore((s) => s.isAuth);
	const openModal = useModalStore((s) => s.openModal);
	const [likedAt, setLikedAt] = useLocalStorage<ILikedAt[]>(`likedAt`, []);
	const { getCommentsCount } = useComments();

	const likedAtObj = useMemo(
		() => likedAt.find((el) => el.postId === postId),
		[likedAt, postId]
	);

	const handleLike = useCallback(() => {
		if (!isAuth) {
			openModal('needAuth');
			return;
		}

		const currentLiked = likedAt.find((el) => el.postId === postId);

		if (
			currentLiked &&
			currentLiked.isLiked &&
			!isLikeExpired(currentLiked.date) &&
			currentLiked.postId === postId &&
			currentLiked.userId === profile?.id
		) {
			return;
		}

		setLikedAt((prev) => {
			const filteredPrev = prev.filter((o) => o.postId !== postId);
			return [
				...filteredPrev,
				{
					postId,
					date: Date.now(),
					isLiked: true,
					userId: profile ? profile.id : null,
				},
			];
		});
	}, [isAuth, likedAt, openModal, postId, profile, setLikedAt]);

	return (
		<div className='flex flex-col gap-y-6 md:flex-row justify-between'>
			{tags && <TagsList tags={tags} />}
			<ul className='flex gap-x-6'>
				<li>
					<Button
						variant='clear'
						className={cn(
							'flex items-center gap-x-2',
							likedAtObj?.isLiked && 'hover:text-foreground'
						)}
						disabled={
							likedAtObj?.isLiked &&
							!isLikeExpired(likedAtObj.date) &&
							likedAtObj.userId === profile?.id &&
							likedAtObj.postId === postId
						}
						onClick={handleLike}>
						<Heart
							className={cn(
								likedAtObj?.isLiked &&
									!isLikeExpired(likedAtObj.date) &&
									likedAtObj.userId === profile?.id &&
									'stroke-red-500 fill-red-500'
							)}
						/>
						<span className='text-xs font-medium'>{likesCount}</span>
					</Button>
				</li>
				<li className='flex items-center gap-x-2'>
					<MessageSquare />
					<span className='text-xs font-medium'>{getCommentsCount()}</span>
				</li>
				<li className='flex items-center gap-x-2'>
					<Eye />
					<span className='text-xs font-medium'>{viewsCount}</span>
				</li>
			</ul>
		</div>
	);
};
