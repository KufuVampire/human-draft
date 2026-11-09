import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UnsubscribeButton } from './UnsubscribeButton';

const mockAddSubscription = vi.fn();
const mockRemoveSubscription = vi.fn();
const mockSetSubscribe = vi.fn();
let mockUnsubscribeMutation: any = vi.fn();
let shouldFailMutation = false;

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
	useUnsubscribeMutation: (options?: any) => {
		mockUnsubscribeMutation = vi.fn((vars) => {
			if (shouldFailMutation && options?.onError) {
				options.onError(new Error('Mutation failed'));
			}
		});
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
		shouldFailMutation = false;
	});

	it('выполняет оптимистичную отписку при клике', () => {
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

	it('откатывает отписку, восстанавливает состояние и показывает toast.error при сбое мутации', () => {
		shouldFailMutation = true;
		render(
			<UnsubscribeButton toId='target-user' setSubscribe={mockSetSubscribe} />
		);

		fireEvent.click(screen.getByText('unsubscribe'));

		expect(mockUnsubscribeMutation).toHaveBeenCalledWith({
			variables: { toId: 'target-user' },
		});
		expect(mockAddSubscription).toHaveBeenCalledWith('target-user');
		expect(mockSetSubscribe).toHaveBeenCalledWith(true);
		expect(toast.error).toHaveBeenCalledWith('unsubscribeError');
	});
});
