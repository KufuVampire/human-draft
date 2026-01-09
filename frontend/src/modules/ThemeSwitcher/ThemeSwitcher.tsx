'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useState } from 'react';

import { useLocalStorage } from '@/hooks';
import { cn } from '@/utils';

export const ThemeSwitcher = () => {
	const t = useTranslations('header');
	const [theme, setTheme] = useLocalStorage('theme', 'light');
	const [isChecked, setChecked] = useState(false);
	const [mounted, setMounted] = useState(false);

	useLayoutEffect(() => {
		const isDark = theme === 'dark';

		document.body.classList.toggle('dark', isDark);
		setChecked(isDark);
		setMounted(true);
	}, [theme]);

	const handleChange = () => {
		const isDark = theme === 'dark';
		setTheme(isDark ? 'light' : 'dark');
		setChecked(isDark);
	};

	if (!mounted) return null;

	return (
		<label
			aria-label={t(`theme.${theme}`)}
			title={t(`theme.${theme}`)}
			className={cn(
				'flex items-center cursor-pointer relative bg-text py-1 px-1 md:px-1.5 rounded-full md:gap-x-2 transition-colors duration-500',
				{
					['bg-secondary']: !isChecked,
				}
			)}>
			<div
				className={cn(
					'relative z-10 rounded-full p-0.5 md:p-1 transition-all duration-500 bg-layout',
					{
						['bg-transparent md:translate-x-[calc(100%+0.5rem)] translate-x-[calc(100%+0.125rem)]']: isChecked,
					}
				)}>
				<Sun
					className={cn('transition-colors duration-500 stroke-secondary size-4 md:size-6', {
						['stroke-none']: isChecked,
					})}
				/>
			</div>
			<div
				className={cn(
					'relative z-10 rounded-full p-0.5 md:p-1 transition-all duration-500 bg-transparent',
					{
						['bg-secondary']: isChecked,
						['md:-translate-x-[calc(100%+0.5rem)] -translate-x-[calc(100%+0.125rem)]']: !isChecked,
					}
				)}>
				<Moon
					className={cn('transition-colors duration-500 stroke-none size-4 md:size-6', {
						['stroke-layout']: isChecked,
					})}
				/>
			</div>
			<div
				className={cn(
					'absolute top-1 left-1 md:left-1.5 p-2.5 md:p-4 rounded-full bg-layout transition-transform duration-500',
					isChecked && 'md:translate-x-[calc(100%+0.5rem)] translate-x-full bg-secondary'
				)}
			/>
			<input
				type='checkbox'
				checked={isChecked}
				onChange={handleChange}
				className='appearance-none sr-only'
				name='theme-switcher'
			/>
		</label>
	);
};
