'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button, LanguageSwitcher, Navigation } from '@/shared';
import { cn } from '@/utils';

export const Dashboard = () => {
	const t = useTranslations('dashboard');
	const [isExpanded, setExpanded] = useState(true);

	const handleClick = () => {
		setExpanded((prev) => !prev);
	};

	return (
		<aside
			className={cn(
				'sticky py-6 top-0 bg-[var(--background-color-card)] shadow-primary rounded-xl md:flex flex-col hidden gap-y-8 h-min max-w-[10.625rem] transition-colors',
				!isExpanded ? 'px-6' : 'w-full'
			)}>
			<Button
				variant='clear'
				className={cn(
					'justify-normal gap-x-1 w-full text-xl leading-[1.375rem] hover:stroke-primary-hover px-2.5',
					!isExpanded && 'justify-center'
				)}
				onClick={handleClick}
				title={t(isExpanded ? 'collapse' : 'expand')}>
				<ArrowLeft
					className={cn(
						'transition-transform duration-300 size-6',
						!isExpanded && 'rotate-180'
					)}
				/>
				<span className={cn(!isExpanded && 'hidden')}>{t('collapse')}</span>
			</Button>
			<Navigation isExpanded={isExpanded} />
			<LanguageSwitcher
				className='px-2.5'
				isExpanded={isExpanded}
			/>
		</aside>
	);
};
