'use client';

import { useTranslations } from 'next-intl';

import { CustomLink } from '../CustomLink/CustomLink';

import { routesConfig } from '@/config';
import { cn } from '@/utils';

interface Props {
	href?: string;
}

export const CreatePostLink = ({ href }: Props) => {
	const t = useTranslations('btns');

	return (
		<CustomLink
			href={href || routesConfig.postCreate()}
			variant='primary'
			className={cn(
				'w-full py-4 md:font-bold md:text-xl leading-[110%] md:leading-[120%] tracking-[5%] md:tracking-[10%] uppercase rounded-[0.625rem]'
			)}>
			{t('createPost')}
		</CustomLink>
	);
};
