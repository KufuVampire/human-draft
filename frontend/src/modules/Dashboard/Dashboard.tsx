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
				'sticky py-3.5 pb-0 md:top-26 bg-[var(--background-color-card)] shadow-primary rounded-xl md:flex flex-col hidden gap-y-5.5 h-min w-full max-w-42.5 shrink-0 transition-all z-10',
				!isExpanded && 'max-w-13.5'
			)}>
			<Button
				variant='clear'
				className={cn(
					'justify-normal gap-x-1 w-full text-xl leading-5.5 hover:stroke-primary-hover p-2.5 px-3.5',
					!isExpanded && 'justify-center'
				)}
				onClick={handleClick}
				title={t(isExpanded ? 'collapse' : 'expand')}>
				<ArrowLeft
					className={cn(
						'transition-transform duration-300 size-6 shrink-0',
						!isExpanded && 'rotate-180'
					)}
				/>
				<span className={cn(!isExpanded && 'hidden')}>{t('collapse')}</span>
			</Button>
			<Navigation isExpanded={isExpanded} />
			<LanguageSwitcher
				isExpanded={isExpanded}
			/>
		</aside>
	);
};
