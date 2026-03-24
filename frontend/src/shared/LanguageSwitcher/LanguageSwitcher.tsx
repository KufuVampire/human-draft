'use client';

import { ChevronRight, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { MouseEvent, useCallback, useState } from 'react';

import { Locale, locales, setLocale } from '@/libs';
import { Button, Dropdown, FormField } from '@/shared';
import { cn } from '@/utils';

interface LanguageItem {
	locale: Locale;
	text: string;
}

const languageItems: LanguageItem[] = [
	{
		locale: 'ru',
		text: 'Русский',
	},
	{
		locale: 'en',
		text: 'English',
	},
];

interface Props {
	className?: string;
	isExpanded?: boolean;
}

export const LanguageSwitcher = ({ className, isExpanded = true }: Props) => {
	const currentLocale = useLocale();
	const [isOpen, setOpen] = useState(false);
	const t = useTranslations('dashboard');

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	const handleClick = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const input = target.closest('input');

		if (!input || input.type !== 'radio') return;

		const locale = input.dataset.locale as Locale;

		if (locale === currentLocale || !locales.includes(locale)) {
			return;
		}

		handleClose();
		setLocale(locale);
	};

	const mappedLanguageItems = languageItems.map(({ locale, text }) => (
		<FormField
			key={locale}
			text={isExpanded ? text : locale.toUpperCase()}
			name='language'
			type='radio'
			data-locale={locale}
			className='outline-0 bg-transparent hover:text-primary-hover focus-visible:text-primary-hover gap-x-1 flex justify-normal hover:stroke-primary-hover'
			wrapperClassNames={cn(
				'px-2 md:px-3.5 py-2.5 text-[var(--text-color-main)] gap-x-1',
				currentLocale === locale && !isExpanded && 'text-primary'
			)}
			inputWrapperClassName={cn(!isExpanded && 'hidden')}
			labelTextClassName='text-[1rem] md:text-xl leading-[1.375rem]'
			checked={currentLocale === locale}
			readOnly
		/>
	));

	return (
		<Dropdown
			isOpen={isOpen}
			setOpen={setOpen}
			items={mappedLanguageItems}
			className={className}
			listClassName={cn(
				'static h-0 bg-transparent shadow-none overflow-x',
				isOpen && 'h-auto'
			)}
			displayDirection='top'
			onClick={handleClick}>
			<Button
				variant='clear'
				className={cn(
					'gap-x-1 w-full text-[1rem] md:text-xl leading-[1.375rem] hover:stroke-primary-hover justify-between p-2 md:p-2.5 md:px-3.5',
					!isExpanded && 'justify-center'
				)}
				onClick={() => setOpen((prev) => !prev)}>
				<div className='flex items-center gap-x-1'>
					<Globe />
					<span className={cn(!isExpanded && 'md:hidden')}>
						{t('language')}
					</span>
				</div>
				<ChevronRight
					className={cn(
						'transition-transform shrink-0',
						!isExpanded && 'md:hidden',
						isOpen && 'rotate-90'
					)}
				/>
			</Button>
		</Dropdown>
	);
};
