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
			listClassName='w-full'>
			<Button
				variant='clear'
				className='flex gap-x-5 items-center bg-surface-card px-5 py-4 rounded-card text-xl leading-heading-tight shadow'
				onClick={() => setOpen((prev) => !prev)}>
				<SlidersHorizontal />
				{t('homePage.filters')}
			</Button>
		</Dropdown>
	);
};
