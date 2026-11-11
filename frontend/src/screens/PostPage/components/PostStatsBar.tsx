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
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center justify-between pt-6 border-t border-border-subtle'>
			{tags && <TagsList tags={tags} />}
			<ul className='flex items-center gap-2 shrink-0'>
				<li>
					<Button
						variant='clear'
						className={cn(
							'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-tag text-muted text-xs font-medium hover:text-foreground transition-colors',
							likedAtObj?.isLiked && 'text-danger hover:text-danger'
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
								'size-4',
								likedAtObj?.isLiked &&
									!isLikeExpired(likedAtObj.date) &&
									likedAtObj.userId === profile?.id &&
									'stroke-danger fill-danger'
							)}
						/>
						<span>{likesCount ?? 0}</span>
					</Button>
				</li>
				<li className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-tag text-muted text-xs font-medium'>
					<MessageSquare className='size-4' />
					<span>{getCommentsCount()}</span>
				</li>
				<li className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-tag text-muted text-xs font-medium'>
					<Eye className='size-4' />
					<span>{viewsCount ?? 0}</span>
				</li>
			</ul>
		</div>
	);
};
