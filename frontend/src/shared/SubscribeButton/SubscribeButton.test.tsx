import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SubscribeButton } from './SubscribeButton';

const mockAddSubscription = vi.fn();
const mockRemoveSubscription = vi.fn();
const mockSetSubscribe = vi.fn();
const mockSetOpenNeedAuth = vi.fn();
let mockProfile: { id: string } | null = { id: 'user-1' };
let mockSubscribeMutation: any = vi.fn();

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

vi.mock('@/hooks', () => ({
	useProfile: () => ({
		profile: mockProfile,
		addSubscription: mockAddSubscription,
		removeSubscription: mockRemoveSubscription,
	}),
}));

vi.mock('@/store', () => ({
	useNeedAuthModal: () => ({
		setOpen: mockSetOpenNeedAuth,
	}),
}));

vi.mock('@/graphql/generated/output', () => ({
	useSubscribeMutation: (options?: any) => {
		mockSubscribeMutation = vi.fn((vars) => {
			if (options?.onTriggerError) {
				options.onError(new Error('Mutation failed'));
			}
		});
		return [mockSubscribeMutation, { loading: false }];
	},
}));

vi.mock('sonner', () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe('SubscribeButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockProfile = { id: 'user-1' };
	});

	it('prompts need auth modal when user is not logged in', () => {
		mockProfile = null;
		render(<SubscribeButton toId='target-user' setSubscribe={mockSetSubscribe} />);

		fireEvent.click(screen.getByText('subscribe'));

		expect(mockSetOpenNeedAuth).toHaveBeenCalledWith(true);
		expect(mockAddSubscription).not.toHaveBeenCalled();
		expect(mockSetSubscribe).not.toHaveBeenCalled();
	});

	it('performs optimistic subscription when clicked by logged in user', () => {
		render(<SubscribeButton toId='target-user' setSubscribe={mockSetSubscribe} />);

		fireEvent.click(screen.getByText('subscribe'));

		expect(mockSubscribeMutation).toHaveBeenCalledWith({
			variables: { toId: 'target-user' },
		});
		expect(mockAddSubscription).toHaveBeenCalledWith('target-user');
		expect(mockSetSubscribe).toHaveBeenCalledWith(true);
	});
});
