'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';
import type { ChangeEvent } from 'react';

import { Section } from '@/shared';
import { cn } from '@/utils';

interface Props {
	posterBlobUrl?: string | null;
	hasPoster: boolean;
	altText: string;
	onLoadPoster: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const BlogPosterUpload = ({
	posterBlobUrl,
	hasPoster,
	altText,
	onLoadPoster,
}: Props) => {
	return (
		<Section className='bg-placeholder transition-colors flex flex-col gap-y-6 md:py-0 py-0 rounded-xl w-full relative min-h-60 md:min-h-87.5 overflow-hidden group'>
			{posterBlobUrl && (
				<Image
					src={posterBlobUrl}
					alt={altText}
					sizes='100%'
					fill
				/>
			)}
			<label
				className={cn(
					'w-full h-full group flex items-center justify-center cursor-pointer',
					hasPoster &&
						'absolute inset-0 bg-[rgba(0,0,0,0.4)] group-hover:opacity-100 md:opacity-0 transition-opacity duration-300'
				)}>
				<div className='bg-primary rounded-full size-30 flex items-center justify-center p-2.5'>
					<Plus className='size-25 stroke-secondary' />
				</div>
				<input
					type='file'
					className='hidden'
					id='poster'
					name='poster'
					onChange={onLoadPoster}
				/>
			</label>
		</Section>
	);
};
