'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/utils';

export const ThemeSwitcher = () => {
	const t = useTranslations('header');
	const { theme, setTheme } = useTheme();
	const [isChecked, setChecked] = useState(false);
	const [mounted, setMounted] = useState(false);

	const isDark = theme === 'dark';
	useEffect(() => {
		setChecked(isDark);
		setMounted(true);
	}, [isDark]);

	const handleChange = useCallback(() => {
		const nextDark = !isDark;
		setTheme(nextDark ? 'dark' : 'light');
		setChecked(nextDark);
	}, [isDark, setTheme]);

	if (!mounted) return null;

	return (
		<label
			aria-label={t(`theme.${theme}`) || t('theme.light')}
			title={t(`theme.${theme}`) || t('theme.light')}
			className='relative flex items-center justify-between w-14 h-8 md:w-16 md:h-9 px-1.5 rounded-full bg-surface-tag border border-border-subtle hover:border-primary/50 shadow-inner cursor-pointer transition-all select-none'>
			<Sun
				className={cn(
					'size-3.5 md:size-4 z-10 transition-colors',
					!isChecked ? 'text-amber-500' : 'text-muted'
				)}
			/>
			<Moon
				className={cn(
					'size-3.5 md:size-4 z-10 transition-colors',
					isChecked ? 'text-primary' : 'text-muted'
				)}
			/>
			<div
				className={cn(
					'absolute top-1 left-1 size-6 md:size-7 rounded-full bg-surface-card border border-border-subtle shadow-xs transition-transform duration-300',
					isChecked ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'
				)}
			/>
			<input
				type='checkbox'
				checked={isChecked}
				onChange={handleChange}
				className='sr-only'
				name='theme-switcher'
			/>
		</label>
	);
};
