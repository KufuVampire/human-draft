'use client';

import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ChangeEvent } from 'react';

import { Button, Section, TagsList } from '@/shared';

interface Props {
	title: string;
	description?: string | null;
	tags?: { id: string; name: string }[] | null;
	currentPosterUrl?: string | null;
	isOwner: boolean;
	isPosterUpdating: boolean;
	isPosterDeleting: boolean;
	onChangePoster: (e: ChangeEvent<HTMLInputElement>) => void;
	onDeletePoster: () => void;
}

export const BlogHeader = ({
	title,
	description,
	tags,
	currentPosterUrl,
	isOwner,
	isPosterUpdating,
	isPosterDeleting,
	onChangePoster,
	onDeletePoster,
}: Props) => {
	const t = useTranslations();

	return (
		<Section
			className='py-0 md:py-0 relative overflow-hidden rounded-xl bg-placeholder before:absolute before:inset-0 before:bg-[rgba(0,0,0,0.4)] before:z-0 bg-no-repeat bg-size-[100%_330px]'
			style={
				currentPosterUrl
					? {
							backgroundImage: `url(${currentPosterUrl})`,
						}
					: undefined
			}>
			<div className='w-full p-3 pt-16 md:p-6 md:pt-10 z-10 relative min-h-82.5 flex flex-col justify-between'>
				<div className='w-full flex flex-col gap-y-7.5 md:gap-y-12'>
					<h1 className='font-title font-bold text-[1.75rem] md:text-5xl leading-heading-tight w-full text-center text-secondary'>
						{title}
					</h1>
					<div className='flex flex-col gap-y-4'>
						{description && (
							<p className='leading-body tracking-snug text-secondary'>
								{description}
							</p>
						)}
						{tags && (
							<TagsList
								tags={tags}
								location='blog'
							/>
						)}
					</div>
				</div>
				{isOwner && (
					<div className='flex gap-x-2 self-end'>
						<label className='text-secondary px-3 rounded-lg leading-6 backdrop-blur-disabled hover:text-accent-hover focus-visible:text-accent-hover cursor-pointer transition-colors text-left z-10 relative bg-disabled py-2'>
							{t('btns.editPoster')}
							<input
								type='file'
								className='hidden'
								onChange={onChangePoster}
								disabled={isPosterDeleting || isPosterUpdating}
							/>
						</label>
						{currentPosterUrl && (
							<Button
								variant='light'
								className='p-2 rounded-lg'
								onClick={onDeletePoster}>
								<Trash />
							</Button>
						)}
					</div>
				)}
			</div>
		</Section>
	);
};
