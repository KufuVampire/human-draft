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
	const { profile } = useProfile();

	const isOwner = profile?.username === author.username;

	return (
		<li className='bg-[var(--background-color-card)] transition-all rounded-xl hover:shadow-primary overflow-hidden self-start lg:max-w-115 min-w-85 w-full break-inside-avoid not-last:mb-6'>
			{posterUrl && (
				<Image
					src={posterUrl}
					alt={title}
					width={460}
					height={200}
					className='size-full max-h-37.5 md:min-h-50 max-h-50'
					loading='eager'
				/>
			)}
			{!posterUrl && (
				<div className='bg-placeholder size-full max-h-37.5 md:min-h-50 max-h-50' />
			)}
			<div className='flex flex-col gap-y-5 transition-colors hover:text-[var(--text-color-main)] py-5 px-4'>
				<div className='flex flex-col gap-y-3'>
					<h2>
						<CustomLink
							href={routesConfig.blogById(id)}
							className='font-bold text-[1.75rem] md:text-4xl leading-[110%] font-title text-left wrap-break-word text-wrap hyphens-manual justify-start'>
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
					{description && <p>{description}</p>}
				</div>
				{tags && tags.length > 0 && <TagsList tags={tags} />}
			</div>
		</li>
	);
};
