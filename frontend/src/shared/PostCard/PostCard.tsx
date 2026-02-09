'use client';

import Prism from 'prismjs';
import { useEffect } from 'react';

import { CustomLink } from '../CustomLink/CustomLink';
import { MilkdownContent } from '../MilkdownContent/MilkdownContent';
import { UserBadgeWithCreatedAt } from '../UserBadgeWithCreatedAt/UserBadgeWithCreatedAt';

import { routesConfig } from '@/config';
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
	isOwner?: boolean;
	tags?: { id: string; name: string }[] | null;
}

export const PostCard = ({
	id,
	title,
	content,
	author,
	createdAt,
	isOwner = false,
	tags,
}: Props) => {
	const cuttedContent = {
		...content,
		content: content.content.slice(0, 2),
	};

	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return (
		<li className='bg-[var(--background-color-card)] transition-all rounded-xl py-5 px-4 hover:shadow-primary border-t-16 border-primary self-start lg:max-w-115 min-w-85 w-full break-inside-avoid not-last:mb-6'>
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
					{cuttedContent.content.length > 0 && (
						<MilkdownContent content={milkdownJsonToHtml(cuttedContent)} />
					)}
				</div>
				{tags && tags.length > 0 && (
					<ul className='flex gap-2'>
						{tags.map(({ id, name }) => (
							<li
								key={id}
								className='text-xs leading-[150%] py-0.5 px-1 rounded-[0.125rem] cursor-default bg-secondary dark:bg-placeholder transition-colors'>
								#{name}
							</li>
						))}
					</ul>
				)}
			</div>
		</li>
	);
};
