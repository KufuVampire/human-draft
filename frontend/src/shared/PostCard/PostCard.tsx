'use client';

import { Trash } from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '../Button/Button';
import { CustomLink } from '../CustomLink/CustomLink';
import { MilkdownContent } from '../MilkdownContent/MilkdownContent';
import { TagsList } from '../TagsList/TagsList';
import { UserBadgeWithCreatedAt } from '../UserBadgeWithCreatedAt/UserBadgeWithCreatedAt';

import { routesConfig } from '@/config';
import { useProfile } from '@/store';
import { milkdownJsonToHtml } from '@/utils';

interface Props {
	id: string;
	title: string;
	author: {
		username: string;
		avatarUrl?: string | null;
	};
	content: {
		type: string;
		content: unknown[];
	};
	createdAt: string;
	tags?: { id: string; name: string }[] | null;
	isBlogPage?: boolean;
}

export const PostCard = ({
	id,
	title,
	content,
	author,
	createdAt,
	tags,
	isBlogPage = false,
}: Props) => {
	const { profile } = useProfile();
	const html = useMemo(() => {
		const cuttedContent = {
			...content,
			content: content.content.slice(0, 2),
		};
		return milkdownJsonToHtml(cuttedContent);
	}, [content]);

	const isOwner = profile?.username === author.username;

	return (
		<li className='bg-[var(--background-color-card)] transition-all rounded-xl py-5 px-4 hover:shadow-primary border-t-16 border-primary self-start min-w-85 w-full break-inside-avoid not-last:mb-6 relative w-full'>
			<div className='flex flex-col gap-y-5 transition-colors hover:text-[var(--text-color-main)]'>
				<div className='flex flex-col gap-y-3'>
					<h2>
						<CustomLink
							href={routesConfig.postById(id)}
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
					<MilkdownContent content={html} />
				</div>
				{tags && tags.length > 0 && <TagsList tags={tags} />}
			</div>
			{isBlogPage && isOwner && (
				<Button
					className='p-1 rounded-sm absolute top-1 right-1'
					data-post={id}>
					<Trash />
				</Button>
			)}
		</li>
	);
};
