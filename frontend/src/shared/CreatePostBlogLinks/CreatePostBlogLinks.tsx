'use client';

import { useTranslations } from 'next-intl';

import { CreatePostLink } from '../CreatePostLink/CreatePostLink';
import { CustomLink } from '../CustomLink/CustomLink';

import { routesConfig } from '@/config';
import { useProfileStore } from '@/store';
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
	const isAuth = useProfileStore((s) => s.isAuth);

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
						'w-full py-4 md:font-bold md:text-xl leading-heading-tight md:leading-heading tracking-wider md:tracking-widest uppercase rounded-card',
						variant === 'secondary' && 'dark:text-secondary'
					)}>
					{t(translationKey)}
				</CustomLink>
			))}
		</div>
	);
};
