import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ContentErrorPage from './(content)/error';
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

describe('ErrorPage components (500 Error Boundary)', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('ContentErrorPage renders error content without duplicating outer layout', () => {
		const mockReset = vi.fn();
		const mockError = new Error('Test server failure');

		render(<ContentErrorPage error={mockError} reset={mockReset} />);

		expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
		expect(screen.getByText('Попробовать снова')).toBeInTheDocument();
	});

	it('Root ErrorPage renders standalone fullscreen error without header, sidebar, or footer', () => {
		const mockReset = vi.fn();
		const mockError = new Error('Root layout failure');

		render(<ErrorPage error={mockError} reset={mockReset} />);

		expect(screen.queryByTestId('header')).not.toBeInTheDocument();
		expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
		expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
		expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
	});

	it('invokes reset callback on tryAgain click', () => {
		const mockReset = vi.fn();
		const mockError = new Error('Recoverable error');

		render(<ContentErrorPage error={mockError} reset={mockReset} />);

		const tryAgainButton = screen.getByRole('button', {
			name: 'Попробовать снова',
		});
		fireEvent.click(tryAgainButton);

		expect(mockReset).toHaveBeenCalledTimes(1);
	});
});
