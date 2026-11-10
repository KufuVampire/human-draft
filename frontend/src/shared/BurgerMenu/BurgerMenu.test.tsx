import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BurgerMenu } from './BurgerMenu';

let mockIsAuth = false;
let mockProfile: { username: string; avatarUrl?: string | null } | null = null;

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

vi.mock('@/hooks', () => ({
	useActiveLink: () => () => false,
	useResolvedHref: () => (href: string) => href,
}));

vi.mock('@/store', () => ({
	useProfileStore: (selector?: (s: unknown) => unknown) => {
		const state = {
			isAuth: mockIsAuth,
			profile: mockProfile,
		};
		return selector ? selector(state) : state;
	},
}));

vi.mock('../../Button/Button', () => ({
	Button: ({ children, onClick, ...props }: any) => (
		<button
			onClick={onClick}
			{...props}>
			{children}
		</button>
	),
}));

vi.mock('../CustomLink/CustomLink', () => ({
	CustomLink: ({ children, href, onClick, ...props }: any) => (
		<a
			href={href}
			onClick={onClick}
			{...props}>
			{children}
		</a>
	),
}));

vi.mock('../Dropdown/Dropdown', () => ({
	Dropdown: ({ children, items, isOpen }: any) => (
		<div>
			{children}
			<div data-testid='dropdown-container' data-is-open={isOpen}>
				{items}
			</div>
		</div>
	),
}));

vi.mock('../LanguageSwitcher/LanguageSwitcher', () => ({
	LanguageSwitcher: () => <div data-testid='lang-switcher'>Lang</div>,
}));

vi.mock('../LogoutButton/LogoutButton', () => ({
	LogoutButton: () => <button data-testid='logout-btn'>Logout</button>,
}));

vi.mock('../UserBadge/UserBadge', () => ({
	UserBadge: ({ username }: any) => <div>Badge: {username}</div>,
}));

describe('BurgerMenu (мобильное меню навигации)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockIsAuth = false;
		mockProfile = null;
	});

	it('отображает ссылки «Войти» и «Регистрация» для неавторизованного гостя', () => {
		mockIsAuth = false;
		mockProfile = null;

		render(<BurgerMenu />);

		// Open burger menu
		const burgerButton = screen.getAllByRole('button')[0];
		fireEvent.click(burgerButton);

		// Guest must see Sign In and Sign Up
		expect(screen.getByRole('link', { name: /btns\.signIn/i })).toHaveAttribute(
			'href',
			'/sign-in'
		);
		expect(screen.getByRole('link', { name: /btns\.signUp/i })).toHaveAttribute(
			'href',
			'/sign-up'
		);

		// Guest must see general links
		expect(
			screen.getByRole('link', { name: /navigation\.feed/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole('link', { name: /navigation\.users/i })
		).toBeInTheDocument();

		// Guest must NOT see protected links
		expect(
			screen.queryByRole('link', { name: /navigation\.profile/i })
		).not.toBeInTheDocument();
		expect(screen.queryByTestId('logout-btn')).not.toBeInTheDocument();
	});

	it('отображает профиль, настройки и выход для авторизованного пользователя и скрывает ссылки гостя', () => {
		mockIsAuth = true;
		mockProfile = { username: 'alice', avatarUrl: null };

		render(<BurgerMenu />);

		const burgerButton = screen.getAllByRole('button')[0];
		fireEvent.click(burgerButton);

		// Authorized user sees profile, settings, logout
		expect(
			screen.getByRole('link', { name: /navigation\.profile/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole('link', { name: /navigation\.settingsShort/i })
		).toBeInTheDocument();
		expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
		expect(screen.getByText('Badge: alice')).toBeInTheDocument();

		// Authorized user does NOT see guest login/signup links
		expect(
			screen.queryByRole('link', { name: /btns\.signIn/i })
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('link', { name: /btns\.signUp/i })
		).not.toBeInTheDocument();
	});
});
