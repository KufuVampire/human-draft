import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UnsubscribeButton } from './UnsubscribeButton';

const mockAddSubscription = vi.fn();
const mockRemoveSubscription = vi.fn();
const mockSetSubscribe = vi.fn();
let mockUnsubscribeMutation: any = vi.fn();

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

vi.mock('@/hooks', () => ({
	useProfile: () => ({
		addSubscription: mockAddSubscription,
		removeSubscription: mockRemoveSubscription,
	}),
}));

vi.mock('@/graphql/generated/output', () => ({
	useUnsubscribeMutation: () => {
		mockUnsubscribeMutation = vi.fn();
		return [mockUnsubscribeMutation, { loading: false }];
	},
}));

vi.mock('sonner', () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe('UnsubscribeButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('performs optimistic unsubscription when clicked', () => {
		render(
			<UnsubscribeButton toId='target-user' setSubscribe={mockSetSubscribe} />
		);

		fireEvent.click(screen.getByText('unsubscribe'));

		expect(mockUnsubscribeMutation).toHaveBeenCalledWith({
			variables: { toId: 'target-user' },
		});
		expect(mockRemoveSubscription).toHaveBeenCalledWith('target-user');
		expect(mockSetSubscribe).toHaveBeenCalledWith(false);
	});
});
