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
				'w-full py-4 md:font-bold md:text-xl leading-heading-tight md:leading-heading tracking-wider md:tracking-widest uppercase rounded-card'
			)}>
			{t('createPost')}
		</CustomLink>
	);
};
