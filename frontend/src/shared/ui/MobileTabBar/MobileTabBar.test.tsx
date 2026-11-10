import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MobileTabBar } from './MobileTabBar';

const items = [
	{ label: 'Главная', icon: <span>H</span>, href: '/', isActive: true },
	{ label: 'Поиск', icon: <span>S</span>, href: '/search' },
];

describe('MobileTabBar', () => {
	it('рендерит панель навигации со ссылками', () => {
		render(<MobileTabBar items={items} />);
		expect(
			screen.getByRole('navigation', { name: 'Мобильная навигация' })
		).toBeInTheDocument();
		expect(screen.getByText('Главная')).toBeInTheDocument();
		expect(screen.getByText('Поиск')).toBeInTheDocument();
	});

	it('отмечает активную страницу через aria-current="page"', () => {
		render(<MobileTabBar items={items} />);
		const activeLink = screen.getByRole('link', { name: /Главная/i });
		expect(activeLink).toHaveAttribute('aria-current', 'page');
	});

	it('вызывает onItemClick при клике на элемент', async () => {
		const handleClick = vi.fn();
		render(<MobileTabBar items={items} onItemClick={handleClick} />);
		await userEvent.click(screen.getByRole('link', { name: /Поиск/i }));
		expect(handleClick).toHaveBeenCalledWith('/search');
	});
});
