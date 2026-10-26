'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect } from 'react';

import { Button, Container, CustomLink, Footer, Header, Main } from '@/shared';

interface Props {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
	const t = useTranslations('500');

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<>
			<Header />
			<Main>
				<Container className='flex flex-col gap-x-4 items-center justify-center'>
					<h1 className='flex justify-center items-center font-title mb-2.5'>
						<span className='text-[10rem] md:text-[22.5rem] lg:text-[25rem] leading-[100%]'>
							5
						</span>
						<Image
							src='/duck.webp'
							alt='duck'
							width={440}
							height={440}
							className='h-[10rem] md:h-[22.5rem] lg:h-[25rem] max-w-[10rem] md:max-w-[22.5rem] lg:max-w-[25rem] w-full'
							priority
						/>
						<span className='text-[10rem] md:text-[22.5rem] lg:text-[25rem] leading-[100%]'>
							0
						</span>
					</h1>
					<div className='max-w-[38rem] mb-[1.875rem]'>
						<h2 className='text-center mb-6 font-bold font-title text-xl md:text-4xl leading-10'>
							{t('title')}
						</h2>
						<p className='text-center mb-3 md:text-xl leading-6'>
							{t('description')}
						</p>
						{error.digest && (
							<p className='text-center leading-6 text-xs md:text-[1rem] text-placeholder font-mono'>
								Digest: {error.digest}
							</p>
						)}
					</div>
					<div className='flex flex-wrap gap-4 items-center justify-center'>
						<Button
							variant='primary'
							onClick={() => reset()}
							className='px-4 py-2 rounded-xl text-xs md:text-xl font-bold leading-6 tracking-widest uppercase text-center'>
							{t('tryAgain')}
						</Button>
						<CustomLink
							variant='light'
							href='/'
							className='px-4 py-2 rounded-xl text-xs md:text-xl font-bold leading-6 tracking-widest uppercase text-center'>
							{t('goToMain')}
						</CustomLink>
					</div>
				</Container>
			</Main>
			<Footer />
		</>
	);
}
