'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';

import type { TypeHomePageSearchSchema } from '@/schemas';
import { Button, Dropdown, FormField } from '@/shared';

interface IFilter {
	key: keyof TypeHomePageSearchSchema;
	translationKey: string;
	needAuth: boolean;
}

const filters: IFilter[] = [
	{
		key: 'onlyPosts',
		translationKey: 'filters.posts',
		needAuth: false,
	},
	{
		key: 'onlyBlogs',
		translationKey: 'filters.blogs',
		needAuth: false,
	},
	{
		key: 'onlySubscriptions',
		translationKey: 'filters.subscriptions',
		needAuth: true,
	},
];

interface Props {
	isAuth: boolean;
	register: UseFormRegister<TypeHomePageSearchSchema>;
}

export const HomePageFiltersDropdown = ({ isAuth, register }: Props) => {
	const t = useTranslations();
	const [isOpen, setOpen] = useState(false);

	const filterItems = useMemo(() => {
		return filters
			.filter(({ needAuth }) => !needAuth || isAuth)
			.map(({ key, translationKey }) => (
				<FormField
					key={key}
					text={t(translationKey)}
					type='checkbox'
					{...register(key)}
				/>
			));
	}, [isAuth, register, t]);

	return (
		<Dropdown
			isOpen={isOpen}
			setOpen={setOpen}
			items={filterItems}
			listClassName='min-w-52 bg-surface-card border border-border-subtle shadow-lg p-2 rounded-xl'
			itemClassName='p-2 hover:bg-surface-tag rounded-lg text-sm'>
			<Button
				variant='clear'
				className='flex gap-x-2.5 items-center bg-surface-card border border-border-subtle hover:border-primary/50 shadow-xs px-4 py-3 rounded-xl text-sm font-medium text-foreground transition-all shrink-0'
				onClick={() => setOpen((prev) => !prev)}>
				<SlidersHorizontal className='size-4 text-muted' />
				<span className='hidden sm:inline'>{t('homePage.filters')}</span>
			</Button>
		</Dropdown>
	);
};
