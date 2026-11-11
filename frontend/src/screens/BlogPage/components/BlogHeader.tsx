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
			className='py-0 md:py-0 relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-tag before:absolute before:inset-0 before:bg-black/50 before:z-0 bg-no-repeat bg-cover bg-center'
			style={
				currentPosterUrl
					? {
							backgroundImage: `url(${currentPosterUrl})`,
						}
					: undefined
			}>
			<div className='w-full p-4 pt-16 md:p-8 md:pt-12 z-10 relative min-h-80 flex flex-col justify-between'>
				<div className='w-full flex flex-col gap-y-6 md:gap-y-8'>
					<h1 className='font-title font-bold text-2xl sm:text-3xl md:text-5xl leading-tight w-full text-center text-white drop-shadow-sm'>
						{title}
					</h1>
					<div className='flex flex-col gap-y-4'>
						{description && (
							<p className='leading-relaxed text-sm md:text-base text-white/90 text-center max-w-2xl mx-auto'>
								{description}
							</p>
						)}
						{tags && (
							<div className='flex justify-center'>
								<TagsList
									tags={tags}
									location='blog'
								/>
							</div>
						)}
					</div>
				</div>
				{isOwner && (
					<div className='flex gap-x-2 self-end mt-4'>
						<label className='text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-xl backdrop-blur-md bg-white/20 hover:bg-white/30 cursor-pointer transition-all border border-white/20 text-left z-10 relative'>
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
								className='p-2 rounded-xl bg-white/20 hover:bg-danger/80 text-white backdrop-blur-md border border-white/20 transition-all'
								onClick={onDeletePoster}>
								<Trash className='size-4' />
							</Button>
						)}
					</div>
				)}
			</div>
		</Section>
	);
};
