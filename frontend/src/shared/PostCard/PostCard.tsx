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
	const profile = useProfile((s) => s.profile);
	const previewContent = useMemo(() => {
		if (!content) return null;
		let parsed: unknown = content;
		if (typeof content === 'string') {
			try {
				parsed = JSON.parse(content);
			} catch {
				return content;
			}
		}
		if (typeof parsed !== 'object' || !parsed) return content;
		const rawContent = (parsed as { content?: unknown[] }).content;
		if (!Array.isArray(rawContent)) return parsed;
		return {
			...parsed,
			content: rawContent.slice(0, 2),
		};
	}, [content]);

	const isOwner = profile?.username === author.username;

	return (
		<li className='bg-surface-card rounded-2xl p-6 border border-border-subtle hover:border-primary/50 shadow-xs hover:shadow-md transition-all self-start min-w-80 w-full break-inside-avoid not-last:mb-6 relative group'>
			<div className='flex flex-col gap-y-5 transition-colors'>
				<div className='flex flex-col gap-y-3'>
					<h2>
						<CustomLink
							href={routesConfig.postById(id)}
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
					<MilkdownContent content={previewContent} />
				</div>
				{tags && tags.length > 0 && <TagsList tags={tags} />}
			</div>
			{isBlogPage && isOwner && (
				<Button
					className='p-2 rounded-xl text-muted hover:text-danger hover:bg-danger/10 absolute top-4 right-4 transition-colors'
					data-post={id}>
					<Trash className='size-4' />
				</Button>
			)}
		</li>
	);
};
