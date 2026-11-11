'use client';

import Image from 'next/image';

import { CustomLink } from '../CustomLink/CustomLink';
import { TagsList } from '../TagsList/TagsList';
import { UserBadgeWithCreatedAt } from '../UserBadgeWithCreatedAt/UserBadgeWithCreatedAt';

import { routesConfig } from '@/config';
import { useProfile } from '@/store';

interface Props {
	id: string;
	title: string;
	author: {
		username: string;
		avatarUrl?: string | null;
	};
	description?: string;
	createdAt: string;
	tags?: { id: string; name: string }[] | null;
	posterUrl?: string | null;
}

export const BlogCard = ({
	id,
	title,
	description,
	author,
	createdAt,
	tags,
	posterUrl,
}: Props) => {
	const profile = useProfile((s) => s.profile);

	const isOwner = profile?.username === author.username;

	return (
		<li className='bg-surface-card rounded-2xl border border-border-subtle hover:border-primary/50 shadow-xs hover:shadow-md transition-all overflow-hidden self-start min-w-0 w-full break-inside-avoid mb-6 inline-block group'>
			{posterUrl && (
				<Image
					src={posterUrl}
					alt={title}
					width={460}
					height={200}
					className='w-full h-44 sm:h-52 object-cover'
					loading='eager'
				/>
			)}
			<div className='flex flex-col gap-y-4 py-5 px-6'>
				<div className='flex flex-col gap-y-3'>
					<h2>
						<CustomLink
							href={routesConfig.blogById(id)}
							className='font-bold text-2xl md:text-3xl leading-snug font-title text-foreground group-hover:text-primary transition-colors text-left wrap-break-word justify-start'>
							{title}
						</CustomLink>
					</h2>
					<div className='flex gap-x-3 items-center'>
						<UserBadgeWithCreatedAt
							author={author}
							isOwner={isOwner}
							createdAt={createdAt}
						/>
					</div>
					{description && (
						<p className='text-muted text-sm leading-relaxed line-clamp-3'>
							{description}
						</p>
					)}
				</div>
				{tags && tags.length > 0 && <TagsList tags={tags} />}
			</div>
		</li>
	);
};
