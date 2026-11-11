'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { UseFormRegister } from 'react-hook-form';

import type { TypeHomePageSearchSchema } from '@/schemas';
import { FormField } from '@/shared';
import { Dropdown, DropdownContent, DropdownTrigger } from '@/shared/ui';

interface IFilter {
	key: keyof TypeHomePageSearchSchema;
	translationKey: string;
	needAuth: boolean;
}

const filters: IFilter[] = [
	{ key: 'onlyPosts', translationKey: 'filters.posts', needAuth: false },
	{ key: 'onlyBlogs', translationKey: 'filters.blogs', needAuth: false },
	{ key: 'onlySubscriptions', translationKey: 'filters.subscriptions', needAuth: true },
];

interface Props {
	isAuth: boolean;
	register: UseFormRegister<TypeHomePageSearchSchema>;
}

export const HomePageFiltersDropdown = ({ isAuth, register }: Props) => {
	const t = useTranslations();

	return (
		<Dropdown>
			<DropdownTrigger className='flex gap-x-2.5 items-center bg-surface-card border border-border-subtle hover:border-primary/50 shadow-xs px-4 py-3 rounded-xl text-sm font-medium text-foreground transition-all shrink-0'>
				<SlidersHorizontal className='size-4 text-muted' />
				<span className='hidden sm:inline'>{t('homePage.filters')}</span>
			</DropdownTrigger>
			<DropdownContent align='end' className='min-w-56 p-2 flex flex-col gap-1 rounded-xl shadow-lg'>
				{filters
					.filter(({ needAuth }) => !needAuth || isAuth)
					.map(({ key, translationKey }) => (
						<div key={key} className='p-2 hover:bg-surface-tag rounded-lg text-sm'>
							<FormField
								text={t(translationKey)}
								type='checkbox'
								{...register(key)}
							/>
						</div>
					))}
			</DropdownContent>
		</Dropdown>
	);
};
