'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect } from 'react';

import { Button, CustomLink } from '@/shared';

interface Props {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ContentErrorPage({ error, reset }: Props) {
	const t = useTranslations('500');

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className='flex flex-col items-center justify-center w-full py-4 my-auto'>
			<h1 className='flex justify-center items-center font-title mb-2 select-none'>
				<span className='text-6xl md:text-8xl lg:text-9xl font-bold leading-none'>
					5
				</span>
				<Image
					src='/duck.webp'
					alt='duck'
					width={180}
					height={180}
					className='h-20 w-20 md:h-28 md:w-28 lg:h-36 lg:w-36 object-contain mx-1'
					priority
				/>
				<span className='text-6xl md:text-8xl lg:text-9xl font-bold leading-none'>
					0
				</span>
			</h1>
			<div className='max-w-xl mb-5 text-center'>
				<h2 className='text-center mb-3 font-bold font-title text-lg md:text-2xl leading-tight'>
					{t('title')}
				</h2>
				<p className='text-center mb-2 text-sm md:text-base leading-snug'>
					{t('description')}
				</p>
				{error.digest && (
					<p className='text-center text-xs text-placeholder font-mono leading-snug'>
						Digest: {error.digest}
					</p>
				)}
			</div>
			<div className='flex flex-wrap gap-4 items-center justify-center'>
				<Button
					variant='primary'
					onClick={() => reset()}
					className='px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold tracking-wider uppercase text-center'>
					{t('tryAgain')}
				</Button>
				<CustomLink
					variant='light'
					href='/'
					className='px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold tracking-wider uppercase text-center'>
					{t('goToMain')}
				</CustomLink>
			</div>
		</div>
	);
}
