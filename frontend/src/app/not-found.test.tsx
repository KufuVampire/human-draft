import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NotFound from './not-found';

vi.mock('next-intl/server', () => ({
	getTranslations: () =>
		Promise.resolve((key: string) => {
			const translations: Record<string, string> = {
				title: 'Упс! Страница потерялась',
				description: 'Но не волнуйтесь, вы нашли Отладочную Уточку',
				bottomText: 'Если уточка молчит, попробуйте вернуться на главную',
				goToMain: 'Спасибо, Уточка, я на главную',
			};
			return translations[key] ?? key;
		}),
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

describe('NotFound component (404 Page)', () => {
	it('renders not found page with Duck content and link to home', async () => {
		const component = await NotFound();
		render(component);

		expect(screen.getByText('Упс! Страница потерялась')).toBeInTheDocument();
		expect(
			screen.getByText('Но не волнуйтесь, вы нашли Отладочную Уточку')
		).toBeInTheDocument();
		expect(screen.getByAltText('duck')).toBeInTheDocument();

		const homeLink = screen.getByRole('link', {
			name: 'Спасибо, Уточка, я на главную',
		});
		expect(homeLink).toHaveAttribute('href', '/');
	});
});
