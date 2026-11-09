import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SubscribeButton } from './SubscribeButton';

const mockAddSubscription = vi.fn();
const mockRemoveSubscription = vi.fn();
const mockSetSubscribe = vi.fn();
const mockOpenModal = vi.fn();
let mockProfile: { id: string } | null = { id: 'user-1' };
let mockSubscribeMutation: any = vi.fn();
let shouldFailMutation = false;

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
	useModalStore: (selector?: (s: unknown) => unknown) => {
		const state = {
			openModal: mockOpenModal,
		};
		return selector ? selector(state) : state;
	},
}));

vi.mock('@/graphql/generated/output', () => ({
	useSubscribeMutation: (options?: any) => {
		mockSubscribeMutation = vi.fn((vars) => {
			if (shouldFailMutation && options?.onError) {
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
		shouldFailMutation = false;
	});

	it('открывает модалку авторизации, если пользователь не авторизован', () => {
		mockProfile = null;
		render(
			<SubscribeButton toId='target-user' setSubscribe={mockSetSubscribe} />
		);

		fireEvent.click(screen.getByText('subscribe'));

		expect(mockOpenModal).toHaveBeenCalledWith('needAuth');
		expect(mockAddSubscription).not.toHaveBeenCalled();
		expect(mockSetSubscribe).not.toHaveBeenCalled();
	});

	it('выполняет оптимистичную подписку при клике авторизованного пользователя', () => {
		render(
			<SubscribeButton toId='target-user' setSubscribe={mockSetSubscribe} />
		);

		fireEvent.click(screen.getByText('subscribe'));

		expect(mockSubscribeMutation).toHaveBeenCalledWith({
			variables: { toId: 'target-user' },
		});
		expect(mockAddSubscription).toHaveBeenCalledWith('target-user');
		expect(mockSetSubscribe).toHaveBeenCalledWith(true);
	});

	it('откатывает подписку, сбрасывает состояние и показывает toast.error при сбое мутации', () => {
		shouldFailMutation = true;
		render(
			<SubscribeButton toId='target-user' setSubscribe={mockSetSubscribe} />
		);

		fireEvent.click(screen.getByText('subscribe'));

		expect(mockSubscribeMutation).toHaveBeenCalledWith({
			variables: { toId: 'target-user' },
		});
		expect(mockRemoveSubscription).toHaveBeenCalledWith('target-user');
		expect(mockSetSubscribe).toHaveBeenCalledWith(false);
		expect(toast.error).toHaveBeenCalledWith('subscribeError');
	});
});
