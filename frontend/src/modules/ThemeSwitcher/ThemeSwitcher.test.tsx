import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeSwitcher } from './ThemeSwitcher';

const setTheme = vi.fn();
let mockTheme = 'light';

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

vi.mock('next-themes', () => ({
	useTheme: () => ({ theme: mockTheme, setTheme }),
}));

describe('ThemeSwitcher (переключатель темы)', () => {
	beforeEach(() => {
		setTheme.mockClear();
		mockTheme = 'light';
	});

	it('в светлой теме показывает выключенный переключатель и включает тёмную по клику', () => {
		render(<ThemeSwitcher />);

		const switcher = screen.getByRole('switch');
		expect(switcher).toHaveAttribute('aria-checked', 'false');
		expect(switcher).toHaveAttribute('aria-label', 'theme.light');

		fireEvent.click(switcher);

		expect(setTheme).toHaveBeenCalledWith('dark');
	});

	it('в тёмной теме показывает включённый переключатель и возвращает светлую по клику', () => {
		mockTheme = 'dark';
		render(<ThemeSwitcher />);

		const switcher = screen.getByRole('switch');
		expect(switcher).toHaveAttribute('aria-checked', 'true');
		expect(switcher).toHaveAttribute('aria-label', 'theme.dark');

		fireEvent.click(switcher);

		expect(setTheme).toHaveBeenCalledWith('light');
	});
});
