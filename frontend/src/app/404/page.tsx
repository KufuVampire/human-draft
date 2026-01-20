import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { fetchMe } from '@/api';
import { NO_INDEX_PAGE } from '@/consts';
import { Container, CustomLink, Footer, Header, Main } from '@/shared';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('404.metadata');

	return {
		title: t('title'),
		...NO_INDEX_PAGE,
	};
}

export default async function NotFound() {
	const t = await getTranslations('404');

	const profile = await fetchMe();

	return (
		<>
			<Header userProfile={profile} />
			<Main>
				<Container className='flex flex-col gap-x-4 items-center justify-center'>
					<h1 className='flex justify-center items-center font-title mb-2.5'>
						<span className='text-[10rem] md:text-[22.5rem] lg:text-[25rem] leading-[100%]'>
							4
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
							4
						</span>
					</h1>
					<div className='max-w-[38rem] mb-[1.875rem]'>
						<h2 className='text-center mb-6 font-bold font-title text-xl md:text-4xl leading-10'>
							{t('title')}
						</h2>
						<p className='text-center mb-3 md:text-xl leading-6'>
							{t('description')}
						</p>
						<p className='text-center leading-6 text-xs md:text-[1rem] text-placeholder'>
							{t('bottomText')}
						</p>
					</div>
					<CustomLink
						variant='primary'
						href='/'
						className='px-4 py-2 rounded-xl text-xs md:text-xl font-bold leading-6 tracking-widest uppercase text-center'>
						{t('goToMain')}
					</CustomLink>
				</Container>
			</Main>
			<Footer />
		</>
	);
}
