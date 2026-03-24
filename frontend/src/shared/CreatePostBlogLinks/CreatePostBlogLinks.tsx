'use client';

import { useTranslations } from 'next-intl';

import { CreatePostLink } from '../CreatePostLink/CreatePostLink';
import { CustomLink } from '../CustomLink/CustomLink';

import { routesConfig } from '@/config';
import { useProfile } from '@/hooks';
import { cn } from '@/utils';

const linkItems = [
	{
		href: routesConfig.blogCreate(),
		translationKey: 'createBlog',
		variant: 'secondary',
	},
];

export const CreatePostBlogLinks = () => {
	const t = useTranslations('btns');
	const { isAuth } = useProfile();

	if (!isAuth) return;

	return (
		<div className='flex flex-col md:flex-row gap-x-6 gap-y-3'>
			<CreatePostLink />
			{linkItems.map(({ href, translationKey, variant }) => (
				<CustomLink
					key={href}
					href={href}
					variant={variant === 'secondary' ? 'secondary' : 'primary'}
					className={cn(
						'w-full py-4 md:font-bold md:text-xl leading-[110%] md:leading-[120%] tracking-[5%] md:tracking-[10%] uppercase rounded-[0.625rem]',
						variant === 'secondary' && 'dark:text-secondary'
					)}>
					{t(translationKey)}
				</CustomLink>
			))}
		</div>
	);
};
