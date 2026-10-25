import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateCommentField } from './CreateCommentField';

const mockCreateComment = vi.fn();
const mockAddComment = vi.fn();
let mockIsAuth = true;

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

vi.mock('next/navigation', () => ({
	useParams: () => ({ postId: 'post-123' }),
}));

vi.mock('@/hooks', () => ({
	useProfile: () => ({
		profile: { id: 'user-1', username: 'alice', avatarUrl: null },
		isAuth: mockIsAuth,
	}),
}));

vi.mock('@/store', () => ({
	useComments: () => ({
		addComment: mockAddComment,
	}),
}));

vi.mock('@/graphql/generated/output', () => ({
	useCreateCommentMutation: (options?: {
		onCompleted?: (data: {
			createComment: {
				id: string;
				text: string;
				createdAt: string;
				author: { username: string; avatarUrl: string | null };
				replies: [];
			};
		}) => void;
	}) => {
		return [
			(args: { variables: { postId: string; text: string; parentId?: string } }) => {
				mockCreateComment(args);
				options?.onCompleted?.({
					createComment: {
						id: 'new-comment-1',
						text: args.variables.text,
						createdAt: '2026-10-26T00:00:00.000Z',
						author: { username: 'alice', avatarUrl: null },
						replies: [],
					},
				});
			},
			{ loading: false },
		];
	},
}));

vi.mock('../UserBadge/UserBadge', () => ({
	UserBadge: () => <div data-testid='user-badge' />,
}));

describe('CreateCommentField (colocated unit tests)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockIsAuth = true;
	});

	it('неавторизованный пользователь видит сообщение о необходимости входа', async () => {
		mockIsAuth = false;
		await act(async () => {
			render(<CreateCommentField />);
		});

		expect(
			screen.getByText('Только авторизованные пользователи могут оставить комментарий')
		).toBeInTheDocument();
		expect(screen.queryByPlaceholderText('fields.comment')).not.toBeInTheDocument();
	});

	it('кнопка отправки заблокирована при пустом поле ввода', () => {
		render(<CreateCommentField />);

		const submitBtn = screen.getByRole('button', { name: 'comments.leaveComment' });
		expect(submitBtn).toBeDisabled();
	});

	it('кнопка отправки остается заблокированной при вводе одних пробелов', async () => {
		const user = userEvent.setup();
		render(<CreateCommentField />);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.type(input, '     ');

		const submitBtn = screen.getByRole('button', { name: 'comments.leaveComment' });
		expect(submitBtn).toBeDisabled();
	});

	it('кнопка отправки разблокируется при вводе непустого текста', async () => {
		const user = userEvent.setup();
		render(<CreateCommentField />);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.type(input, 'Привет, отличная статья!');

		const submitBtn = screen.getByRole('button', { name: 'comments.leaveComment' });
		expect(submitBtn).toBeEnabled();
	});

	it('кнопка отмены очищает поле ввода и сбрасывает ветку ответа', async () => {
		const user = userEvent.setup();
		const setReply = vi.fn();
		render(<CreateCommentField setReply={setReply} />);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.type(input, 'Черновик комментария');
		expect(input).toHaveValue('Черновик комментария');

		const cancelBtn = screen.getByRole('button', { name: 'btns.cancel' });
		await user.click(cancelBtn);

		expect(input).toHaveValue('');
		expect(setReply).toHaveBeenCalledWith(false);
	});

	it('отправка формы триггерит мутацию и очищает поле ввода', async () => {
		const user = userEvent.setup();
		render(<CreateCommentField />);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.type(input, 'Полезный материал');

		const submitBtn = screen.getByRole('button', { name: 'comments.leaveComment' });
		await user.click(submitBtn);

		await waitFor(() => {
			expect(mockCreateComment).toHaveBeenCalledWith({
				variables: {
					postId: 'post-123',
					text: 'Полезный материал',
					parentId: undefined,
				},
			});
			expect(mockAddComment).toHaveBeenCalled();
			expect(input).toHaveValue('');
		});
	});
});
