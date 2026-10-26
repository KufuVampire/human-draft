import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { NO_INDEX_PAGE } from '@/consts';
import { CustomLink } from '@/shared';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('404.metadata');

	return {
		title: t('title'),
		...NO_INDEX_PAGE,
	};
}

export default async function ContentNotFound() {
	const t = await getTranslations('404');

	return (
		<div className='flex flex-col gap-x-4 items-center justify-center w-full min-h-[calc(100vh-16rem)] py-8'>
			<h1 className='flex justify-center items-center font-title mb-2.5'>
				<span className='text-[7rem] md:text-[14rem] lg:text-[16rem] leading-[100%]'>
					4
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
					4
				</span>
			</h1>
			<div className='max-w-[38rem] mb-[1.875rem] text-center'>
				<h2 className='text-center mb-6 font-bold font-title text-xl md:text-3xl leading-10'>
					{t('title')}
				</h2>
				<p className='text-center mb-3 md:text-lg leading-6'>
					{t('description')}
				</p>
				<p className='text-center leading-6 text-xs md:text-[1rem] text-placeholder'>
					{t('bottomText')}
				</p>
			</div>
			<CustomLink
				variant='primary'
				href='/'
				className='px-4 py-2 rounded-xl text-xs md:text-lg font-bold leading-6 tracking-widest uppercase text-center'>
				{t('goToMain')}
			</CustomLink>
		</div>
	);
}
