import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GuestGuard } from './GuestGuard';

let mockIsAuth = false;
let mockIsLoading = false;
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

vi.mock('@/hooks', () => ({
	useProfile: () => ({
		isAuth: mockIsAuth,
		isLoading: mockIsLoading,
	}),
}));

describe('GuestGuard', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockIsAuth = false;
		mockIsLoading = false;
	});

	it('renders skeleton when authentication status is loading', () => {
		mockIsLoading = true;
		render(
			<GuestGuard>
				<div>Auth Content</div>
			</GuestGuard>
		);

		expect(screen.getByTestId('auth-form-skeleton')).toBeInTheDocument();
		expect(screen.queryByText('Auth Content')).not.toBeInTheDocument();
	});

	it('renders children when user is not authenticated', () => {
		mockIsLoading = false;
		mockIsAuth = false;
		render(
			<GuestGuard>
				<div>Auth Content</div>
			</GuestGuard>
		);

		expect(screen.queryByTestId('auth-form-skeleton')).not.toBeInTheDocument();
		expect(screen.getByText('Auth Content')).toBeInTheDocument();
	});

	it('redirects to home when user is already authenticated', () => {
		mockIsLoading = false;
		mockIsAuth = true;
		render(
			<GuestGuard>
				<div>Auth Content</div>
			</GuestGuard>
		);

		expect(mockReplace).toHaveBeenCalledWith('/');
		expect(screen.queryByText('Auth Content')).not.toBeInTheDocument();
	});
});
