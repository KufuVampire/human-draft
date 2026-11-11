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
				'w-full py-3.5 px-6 font-semibold text-sm md:text-base tracking-wider uppercase rounded-xl shadow-xs hover:shadow-primary transition-all text-center'
			)}>
			{t('createPost')}
		</CustomLink>
	);
};
