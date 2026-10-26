import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorPage from './error';

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => {
		const translations: Record<string, string> = {
			title: 'Что-то пошло не так',
			description: 'Произошла ошибка на сервере',
			tryAgain: 'Попробовать снова',
			goToMain: 'Вернуться на главную',
		};
		return translations[key] ?? key;
	},
}));

vi.mock('next/image', () => ({
	default: ({
		priority: _priority,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img {...props} alt={props.alt || ''} />
	),
}));

vi.mock('@/shared', () => ({
	Header: () => <header data-testid='header'>Header</header>,
	Footer: () => <footer data-testid='footer'>Footer</footer>,
	Main: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
	Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	Button: ({
		children,
		onClick,
		...props
	}: {
		children: React.ReactNode;
		onClick?: () => void;
	}) => (
		<button onClick={onClick} {...props}>
			{children}
		</button>
	),
	CustomLink: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode;
		href: string;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

describe('ErrorPage component (500 Error Boundary)', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('renders error page content with translations', () => {
		const mockReset = vi.fn();
		const mockError = new Error('Test server failure');

		render(<ErrorPage error={mockError} reset={mockReset} />);

		expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
		expect(screen.getByText('Произошла ошибка на сервере')).toBeInTheDocument();
		expect(screen.getByText('Попробовать снова')).toBeInTheDocument();
		expect(screen.getByText('Вернуться на главную')).toBeInTheDocument();
	});

	it('displays digest if present in error', () => {
		const mockReset = vi.fn();
		const mockError = Object.assign(new Error('Fatal error'), {
			digest: 'ERR_12345',
		});

		render(<ErrorPage error={mockError} reset={mockReset} />);

		expect(screen.getByText(/ERR_12345/)).toBeInTheDocument();
	});

	it('invokes reset callback when tryAgain button is clicked', () => {
		const mockReset = vi.fn();
		const mockError = new Error('Recoverable error');

		render(<ErrorPage error={mockError} reset={mockReset} />);

		const tryAgainButton = screen.getByRole('button', {
			name: 'Попробовать снова',
		});
		fireEvent.click(tryAgainButton);

		expect(mockReset).toHaveBeenCalledTimes(1);
	});

	it('renders a link to home page', () => {
		const mockReset = vi.fn();
		const mockError = new Error('Recoverable error');

		render(<ErrorPage error={mockError} reset={mockReset} />);

		const homeLink = screen.getByRole('link', {
			name: 'Вернуться на главную',
		});
		expect(homeLink).toHaveAttribute('href', '/');
	});
});
