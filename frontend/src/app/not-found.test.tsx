import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ContentNotFound from './(content)/not-found';
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

vi.mock('@/modules', () => ({
	Dashboard: () => <aside data-testid='sidebar'>Sidebar Dashboard</aside>,
	ConfirmationChangesModal: () => null,
	ConfirmationDeletionModal: () => null,
	CropperModal: () => null,
	NeedAuthModal: () => null,
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

describe('NotFound components (404 Page)', () => {
	it('ContentNotFound renders Duck illustration and link without duplicating layout', async () => {
		const component = await ContentNotFound();
		render(component);

		expect(screen.getByText('Упс! Страница потерялась')).toBeInTheDocument();
		expect(
			screen.getByText('Но не волнуйтесь, вы нашли Отладочную Уточку')
		).toBeInTheDocument();
		expect(screen.getByAltText('duck')).toBeInTheDocument();

		// ContentNotFound should NOT render extra Header/Footer (layout provides them)
		expect(screen.queryByTestId('header')).not.toBeInTheDocument();
		expect(screen.queryByTestId('footer')).not.toBeInTheDocument();

		const homeLink = screen.getByRole('link', {
			name: 'Спасибо, Уточка, я на главную',
		});
		expect(homeLink).toHaveAttribute('href', '/');
	});

	it('Root NotFound renders full layout with Header, Sidebar Dashboard, and Footer', async () => {
		const component = await NotFound();
		render(component);

		expect(screen.getByTestId('header')).toBeInTheDocument();
		expect(screen.getByTestId('sidebar')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();
		expect(screen.getByText('Упс! Страница потерялась')).toBeInTheDocument();
	});
});
