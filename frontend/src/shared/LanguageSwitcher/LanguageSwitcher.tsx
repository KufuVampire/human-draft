'use client';

import { ChevronRight, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { MouseEvent, useRef, useState } from 'react';

import { useClickOutside } from '@/hooks';
import { Locale, locales, setLocale } from '@/libs';
import { Button, Dropdown, RadioButton } from '@/shared';
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

export const LanguageSwitcher = ({ className, isExpanded }: Props) => {
	const currentLocale = useLocale();
	const [isOpen, setOpen] = useState(false);
	const t = useTranslations('dashboard');
	const languageDropdownRef = useRef<HTMLDivElement>(null);

	const handleClick = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const input = target.closest('input');

		if (!input || input.type !== 'radio') return;

		const locale = input.dataset.locale as Locale;

		if (locale === currentLocale || !locales.includes(locale)) {
			return;
		}
		
		handleClose()
		setLocale(locale);
	};

	const mappedLanguageItems = languageItems.map(({ locale, text }) => (
		<RadioButton
			key={locale}
			text={text}
			name='language'
			data-locale={locale}
			className='text-xl leading-[1.375rem] outline-0 bg-transparent hover:text-primary-hover focus-visible:text-primary-hover gap-x-1 flex justify-normal hover:stroke-primary-hover'
			checked={currentLocale === locale}
			readOnly
		/>
	));

	const handleClose = () => {
		setOpen(false);
	};

	useClickOutside(languageDropdownRef, handleClose);

	return (
		<Dropdown
			isOpen={isOpen}
			items={mappedLanguageItems}
			ref={languageDropdownRef}
			className={className}
			listClassName='md:left-0 right-0 px-2.5 py-6 gap-y-3 md:top-[calc(100%+2rem)] bg-[var(--background-color-main)] border border-primary bg-[var(--background-color-card)] origin-top-right md:origin-top-left'
			onClick={handleClick}>
			<Button
				variant='clear'
				className='gap-x-1 w-full text-[1rem] md:text-xl leading-[1.375rem] hover:stroke-primary-hover justify-between'
				onClick={() => setOpen((prev) => !prev)}>
				<div className='flex items-center gap-x-1'>
					<Globe />
					<span className={cn(!isExpanded && 'md:hidden')}>
						{t('language')}
					</span>
				</div>
				<ChevronRight
					className={cn(!isExpanded && 'md:hidden', isOpen && 'rotate-90')}
				/>
			</Button>
		</Dropdown>
	);
};
