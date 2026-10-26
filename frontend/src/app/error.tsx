'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect } from 'react';

import { Dashboard } from '@/modules';
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
				<Container className='flex gap-x-4'>
					<Dashboard />
					<div className='flex flex-col gap-x-4 items-center justify-center w-full min-h-[calc(100vh-16rem)] py-8'>
						<h1 className='flex justify-center items-center font-title mb-2.5'>
							<span className='text-[7rem] md:text-[14rem] lg:text-[16rem] leading-[100%]'>
								5
							</span>
							<Image
								src='/duck.webp'
								alt='duck'
								width={440}
								height={440}
								className='h-[7rem] md:h-[14rem] lg:h-[16rem] max-w-[7rem] md:max-w-[14rem] lg:max-w-[16rem] w-full object-contain'
								priority
							/>
							<span className='text-[7rem] md:text-[14rem] lg:text-[16rem] leading-[100%]'>
								0
							</span>
						</h1>
						<div className='max-w-[38rem] mb-[1.875rem] text-center'>
							<h2 className='text-center mb-6 font-bold font-title text-xl md:text-3xl leading-10'>
								{t('title')}
							</h2>
							<p className='text-center mb-3 md:text-lg leading-6'>
								{t('description')}
							</p>
							{error.digest && (
								<p className='text-center leading-6 text-xs text-placeholder font-mono'>
									Digest: {error.digest}
								</p>
							)}
						</div>
						<div className='flex flex-wrap gap-4 items-center justify-center'>
							<Button
								variant='primary'
								onClick={() => reset()}
								className='px-4 py-2 rounded-xl text-xs md:text-lg font-bold leading-6 tracking-widest uppercase text-center'>
								{t('tryAgain')}
							</Button>
							<CustomLink
								variant='light'
								href='/'
								className='px-4 py-2 rounded-xl text-xs md:text-lg font-bold leading-6 tracking-widest uppercase text-center'>
								{t('goToMain')}
							</CustomLink>
						</div>
					</div>
				</Container>
			</Main>
			<Footer />
		</>
	);
}
