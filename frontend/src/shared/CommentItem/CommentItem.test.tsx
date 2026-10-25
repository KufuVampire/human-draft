import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CommentItem } from './CommentItem';

import { CommentFieldsFragment } from '@/graphql/generated/output';

const mockUpdateComment = vi.fn();
const mockDeleteComment = vi.fn();
const mockDeleteCommentStore = vi.fn();
const mockUpdateCommentStore = vi.fn();
const mockSetCb = vi.fn();
const mockSetOpen = vi.fn();
const mockSetType = vi.fn();
const mockToastError = vi.fn();
let mockCurrentUsername: string | undefined = 'alice';
let mockUpdateShouldFail = false;

vi.mock('sonner', () => ({
	toast: {
		error: (msg: string) => mockToastError(msg),
		success: vi.fn(),
	},
}));

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
	useFormatter: () => ({
		dateTime: () => '12 янв',
	}),
}));

vi.mock('next/navigation', () => ({
	useParams: () => ({ postId: 'post-123' }),
}));

vi.mock('next/link', () => ({
	default: ({
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

vi.mock('next/image', () => ({
	default: ({
		alt,
		...props
	}: {
		alt?: string;
		[key: string]: unknown;
	}) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img alt={alt} {...props} />
	),
}));

vi.mock('@/hooks', () => ({
	useProfile: () => ({
		profile: mockCurrentUsername
			? { id: 'user-1', username: mockCurrentUsername, avatarUrl: null }
			: null,
		isAuth: !!mockCurrentUsername,
	}),
	useCreateAt: () => '26 окт в 12:00',
}));

vi.mock('@/store', () => ({
	useProfile: () => ({
		profile: mockCurrentUsername
			? { id: 'user-1', username: mockCurrentUsername, avatarUrl: null }
			: null,
		isAuth: !!mockCurrentUsername,
	}),
	useComments: () => ({
		deleteComment: mockDeleteCommentStore,
		updateComment: mockUpdateCommentStore,
		addComment: vi.fn(),
	}),
	useConfirmationDeletionModal: () => ({
		setCb: (cb: () => void) => mockSetCb(cb),
		setOpen: mockSetOpen,
		setType: mockSetType,
	}),
}));

vi.mock('@/graphql/generated/output', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@/graphql/generated/output')>();
	return {
		...actual,
		useUpdateCommentMutation: (options?: {
			onCompleted?: () => void;
			onError?: (error: Error) => void;
		}) => {
			return [
				(args: {
					variables: { commentId: string; text: string };
					onCompleted?: () => void;
				}) => {
					mockUpdateComment(args);
					if (mockUpdateShouldFail) {
						options?.onError?.(new Error('Сетевая ошибка'));
						return;
					}
					options?.onCompleted?.();
					args.onCompleted?.();
				},
				{ loading: false },
			];
		},
		useDeleteCommentMutation: () => {
			return [
				(args: { variables: { commentId: string } }) => {
					mockDeleteComment(args);
				},
				{ loading: false },
			];
		},
	};
});

const createComment = (overrides?: Partial<CommentFieldsFragment>): CommentFieldsFragment => ({
	__typename: 'CommentModel',
	id: 'comment-1',
	text: 'Первоначальный текст комментария',
	parentId: null,
	createdAt: '2026-10-25T12:00:00.000Z',
	author: {
		__typename: 'UserModel',
		username: 'alice',
		avatarUrl: null,
	},
	replies: [],
	...overrides,
});

describe('CommentItem (colocated unit tests)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCurrentUsername = 'alice';
		mockUpdateShouldFail = false;
	});

	it('отображает текст комментария с исправленными классами типографики', async () => {
		const comment = createComment();
		await act(async () => {
			render(<CommentItem comment={comment} />);
		});

		const textElement = screen.getByText('Первоначальный текст комментария');
		expect(textElement).toBeInTheDocument();
		expect(textElement).toHaveClass('leading-[150%]');
		expect(textElement).toHaveClass('tracking-[2%]');
	});

	it('скрывает кнопки редактирования и удаления для чужого комментария', async () => {
		mockCurrentUsername = 'bob';
		const comment = createComment();
		await act(async () => {
			render(<CommentItem comment={comment} />);
		});

		expect(
			screen.queryByTitle('postPage.comments.enterEditMode')
		).not.toBeInTheDocument();
		expect(
			screen.queryByTitle('postPage.comments.deleteComment')
		).not.toBeInTheDocument();
	});

	it('переключается в режим редактирования с предзаполненным текстом', async () => {
		const user = userEvent.setup();
		const comment = createComment();
		render(<CommentItem comment={comment} />);

		const editBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(editBtn);

		const input = screen.getByPlaceholderText('fields.comment');
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue('Первоначальный текст комментария');
		expect(input).toHaveFocus();

		// Кнопка сохранения заблокирована, так как текст еще не изменен (!isDirty)
		const saveBtn = screen.getByRole('button', { name: 'comments.updateComment' });
		expect(saveBtn).toBeDisabled();
	});

	it('блокирует кнопку сохранения при пустом поле ввода или только пробелах', async () => {
		const user = userEvent.setup();
		const comment = createComment();
		render(<CommentItem comment={comment} />);

		const editBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(editBtn);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.clear(input);

		const saveBtn = screen.getByRole('button', { name: 'comments.updateComment' });
		expect(saveBtn).toBeDisabled();

		await user.type(input, '    ');
		expect(saveBtn).toBeDisabled();
	});

	it('разблокирует кнопку сохранения при вводе нового валидного текста', async () => {
		const user = userEvent.setup();
		const comment = createComment();
		render(<CommentItem comment={comment} />);

		const editBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(editBtn);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.clear(input);
		await user.type(input, 'Отредактированный текст комментария');

		const saveBtn = screen.getByRole('button', { name: 'comments.updateComment' });
		expect(saveBtn).toBeEnabled();
	});

	it('сбрасывает черновик к исходному тексту при отмене редактирования', async () => {
		const user = userEvent.setup();
		const comment = createComment();
		render(<CommentItem comment={comment} />);

		// Вход в режим редактирования
		const editBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(editBtn);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.clear(input);
		await user.type(input, 'Случайный черновик');
		expect(input).toHaveValue('Случайный черновик');

		// Отмена редактирования кликом по кнопке с иконкой крестика
		const exitEditBtn = screen.getByTitle('postPage.comments.exitEditMode');
		await user.click(exitEditBtn);

		// Форма закрыта, отображается первоначальный текст
		expect(screen.queryByPlaceholderText('fields.comment')).not.toBeInTheDocument();
		expect(screen.getByText('Первоначальный текст комментария')).toBeInTheDocument();

		// Повторный вход в режим редактирования — значение сброшено к исходному
		const reEnterEditBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(reEnterEditBtn);

		const reOpenedInput = screen.getByPlaceholderText('fields.comment');
		expect(reOpenedInput).toHaveValue('Первоначальный текст комментария');
	});

	it('отправка обновления вызывает мутацию, обновляет стор и выходит из режима редактирования', async () => {
		const user = userEvent.setup();
		const comment = createComment();
		render(<CommentItem comment={comment} />);

		const editBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(editBtn);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.clear(input);
		await user.type(input, '  Успешно обновленный текст  ');

		const saveBtn = screen.getByRole('button', { name: 'comments.updateComment' });
		await user.click(saveBtn);

		await waitFor(() => {
			expect(mockUpdateComment).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: {
						commentId: 'comment-1',
						text: 'Успешно обновленный текст',
					},
				})
			);
			expect(mockUpdateCommentStore).toHaveBeenCalledWith('comment-1', 'Успешно обновленный текст');
			// После onCompleted режим редактирования закрывается
			expect(screen.queryByPlaceholderText('fields.comment')).not.toBeInTheDocument();
		});
	});

	it('сохраняет обновленное значение и позволяет повторно редактировать без сброса текста', async () => {
		const user = userEvent.setup();
		const comment = createComment({ text: 'Версия 1' });
		const { rerender } = render(<CommentItem comment={comment} />);

		// 1. Первое редактирование
		const editBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(editBtn);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.clear(input);
		await user.type(input, 'Версия 2');

		const saveBtn = screen.getByRole('button', { name: 'comments.updateComment' });
		await user.click(saveBtn);

		expect(mockUpdateComment).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: {
					commentId: 'comment-1',
					text: 'Версия 2',
				},
			})
		);
		expect(mockUpdateCommentStore).toHaveBeenCalledWith('comment-1', 'Версия 2');

		// Симулируем обновление пропа comment от стора
		rerender(<CommentItem comment={{ ...comment, text: 'Версия 2' }} />);
		expect(screen.getByText('Версия 2')).toBeInTheDocument();

		// 2. Повторное открытие режима редактирования
		const reEditBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(reEditBtn);

		const reOpenedInput = screen.getByPlaceholderText('fields.comment');
		expect(reOpenedInput).toHaveValue('Версия 2');

		// 3. Отмена повторного редактирования — текст остается 'Версия 2'
		const cancelBtn = screen.getByTitle('postPage.comments.exitEditMode');
		await user.click(cancelBtn);

		expect(screen.getByText('Версия 2')).toBeInTheDocument();
	});

	it('показывает toast при ошибке обновления комментария', async () => {
		mockUpdateShouldFail = true;
		const user = userEvent.setup();
		const comment = createComment();
		render(<CommentItem comment={comment} />);

		const editBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(editBtn);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.clear(input);
		await user.type(input, 'Новый текст');

		const saveBtn = screen.getByRole('button', { name: 'comments.updateComment' });
		await user.click(saveBtn);

		await waitFor(() => {
			expect(mockToastError).toHaveBeenCalledWith('Сетевая ошибка');
		});
	});

	it('удаление комментария вызывает модалку подтверждения и выполняет коллбэк', async () => {
		const user = userEvent.setup();
		const comment = createComment();
		render(<CommentItem comment={comment} />);

		const deleteBtn = screen.getByTitle('postPage.comments.deleteComment');
		await user.click(deleteBtn);

		expect(mockSetType).toHaveBeenCalledWith('comment');
		expect(mockSetOpen).toHaveBeenCalledWith(true);
		expect(mockSetCb).toHaveBeenCalled();

		// Симулируем подтверждение в модалке (вызов сохраненного cb)
		const savedCallback = mockSetCb.mock.calls[0][0] as () => void;
		savedCallback();

		expect(mockDeleteCommentStore).toHaveBeenCalledWith('comment-1');
		expect(mockDeleteComment).toHaveBeenCalledWith({
			variables: {
				commentId: 'comment-1',
			},
		});
		expect(mockSetOpen).toHaveBeenCalledWith(false);
	});
});
