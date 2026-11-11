'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/utils';

export const ThemeSwitcher = () => {
	const t = useTranslations('header');
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = theme === 'dark';

	const handleToggle = useCallback(() => {
		setTheme(isDark ? 'light' : 'dark');
	}, [isDark, setTheme]);

	if (!mounted) {
		return (
			<div className='w-16 h-8 rounded-full bg-surface-tag border border-border-subtle shrink-0' />
		);
	}

	return (
		<button
			type='button'
			role='switch'
			aria-checked={isDark}
			aria-label={t(`theme.${theme}`) || t('theme.light')}
			title={t(`theme.${theme}`) || t('theme.light')}
			onClick={handleToggle}
			className='relative flex items-center justify-between w-16 h-8 p-1 rounded-full bg-surface-tag border border-border-subtle hover:border-primary/50 shadow-inner cursor-pointer transition-colors select-none shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary'>
			<Sun
				className={cn(
					'size-4 ml-1 z-10 transition-colors duration-200',
					!isDark ? 'text-amber-500' : 'text-muted'
				)}
			/>
			<Moon
				className={cn(
					'size-4 mr-1 z-10 transition-colors duration-200',
					isDark ? 'text-primary' : 'text-muted'
				)}
			/>
			<span
				className={cn(
					'absolute top-1 left-1 size-6 rounded-full bg-surface-card border border-border-subtle shadow-xs transition-transform duration-200 ease-in-out',
					isDark ? 'translate-x-8' : 'translate-x-0'
				)}
			/>
		</button>
	);
};
