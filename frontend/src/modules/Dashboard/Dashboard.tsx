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
				'sticky p-3 md:top-20 bg-surface-card border border-border-subtle shadow-sm rounded-2xl md:flex flex-col hidden gap-y-4 h-min w-full max-w-52 shrink-0 transition-[max-width,padding] duration-300 ease-in-out overflow-hidden z-10',
				!isExpanded && 'max-w-16 p-2 items-center'
			)}>
			<Button
				variant='clear'
				className={cn(
					'justify-normal gap-x-2 w-full text-sm font-medium hover:bg-surface-tag rounded-xl p-2.5 transition-colors overflow-hidden',
					!isExpanded && 'justify-center p-2 px-0 gap-0'
				)}
				onClick={handleClick}
				title={t(isExpanded ? 'collapse' : 'expand')}>
				<ArrowLeft
					className={cn(
						'transition-transform duration-300 size-5 shrink-0 text-muted',
						!isExpanded && 'rotate-180'
					)}
				/>
				<span
					className={cn(
						'text-muted font-medium whitespace-nowrap overflow-hidden transition-all duration-300',
						!isExpanded ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-40 opacity-100'
					)}>
					{t('collapse')}
				</span>
			</Button>
			<Navigation isExpanded={isExpanded} />
			<LanguageSwitcher
				isExpanded={isExpanded}
			/>
		</aside>
	);
};
