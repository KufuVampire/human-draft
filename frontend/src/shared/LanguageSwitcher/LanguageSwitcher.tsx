'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { Locale, locales, setLocale } from '@/libs';
import { useClickOutside } from '@/hooks';
import { Button } from '../Button/Button';
import { cn } from '@/utils';

interface LanguageItem {
	locale: Locale;
	text: string;
}

const languageItems: LanguageItem[] = [
	{ locale: 'ru', text: 'Русский' },
	{ locale: 'en', text: 'English' },
];

interface Props {
	className?: string;
	isExpanded?: boolean;
}

export const LanguageSwitcher = ({ className, isExpanded = true }: Props) => {
	const currentLocale = useLocale() as Locale;
	const [isOpen, setOpen] = useState(false);
	const t = useTranslations('dashboard');
	const containerRef = useRef<HTMLDivElement>(null);

	useClickOutside(containerRef, () => setOpen(false));

	const handleSelectLocale = (locale: Locale) => {
		if (locale === currentLocale || !locales.includes(locale)) {
			setOpen(false);
			return;
		}
		setOpen(false);
		setLocale(locale);
	};

	const renderOptions = () =>
		languageItems.map(({ locale, text }) => {
			const isSelected = currentLocale === locale;
			return (
				<button
					key={locale}
					type='button'
					onClick={() => handleSelectLocale(locale)}
					className={cn(
						'flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer',
						isSelected
							? 'bg-primary/10 text-primary font-semibold'
							: 'text-muted hover:text-foreground hover:bg-surface-tag'
					)}>
					<div className='flex items-center gap-2'>
						<span className='font-bold uppercase text-xs'>{locale}</span>
						<span>{text}</span>
					</div>
					{isSelected && <Check className='size-3.5 text-primary shrink-0' />}
				</button>
			);
		});

	return (
		<div
			ref={containerRef}
			className={cn('relative flex flex-col w-full', className)}>
			<Button
				variant='clear'
				type='button'
				onClick={() => setOpen((prev) => !prev)}
				title={t('language')}
				className={cn(
					'flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-medium hover:bg-surface-tag text-foreground transition-colors',
					!isExpanded && 'justify-center p-2'
				)}>
				<div className='flex items-center gap-2'>
					<Globe className='size-5 text-muted shrink-0' />
					<span className={cn('text-muted font-medium', !isExpanded && 'hidden')}>
						{t('language')}
					</span>
				</div>
				{isExpanded && (
					<div className='flex items-center gap-1.5'>
						<span className='text-xs font-semibold text-primary uppercase'>
							{currentLocale}
						</span>
						<ChevronDown
							className={cn(
								'size-4 text-muted transition-transform duration-200',
								isOpen && 'rotate-180'
							)}
						/>
					</div>
				)}
			</Button>

			{isOpen && (
				<div
					className={cn(
						'flex flex-col gap-1 p-1 bg-surface-card rounded-xl border border-border-subtle shadow-lg',
						isExpanded
							? 'mt-1'
							: 'absolute left-full ml-3 top-0 z-dropdown w-36 shadow-xl'
					)}>
					{renderOptions()}
				</div>
			)}
		</div>
	);
};
