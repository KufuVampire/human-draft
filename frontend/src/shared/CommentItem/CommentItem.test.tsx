import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CommentItem } from './CommentItem';

import { CommentFieldsFragment } from '@/graphql/generated/output';

const mockUpdateComment = vi.fn();
const mockDeleteComment = vi.fn();
const mockDeleteCommentStore = vi.fn();
const mockSetCb = vi.fn();
const mockSetOpen = vi.fn();
const mockSetType = vi.fn();
let mockCurrentUsername: string | undefined = 'alice';

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
		useUpdateCommentMutation: (options?: { onCompleted?: () => void }) => {
			return [
				(args: { variables: { commentId: string; text: string } }) => {
					mockUpdateComment(args);
					options?.onCompleted?.();
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

		// Отмена редактирования кликом по кнопке-галке
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

	it('отправка обновления вызывает мутацию и выходит из режима редактирования', async () => {
		const user = userEvent.setup();
		const comment = createComment();
		render(<CommentItem comment={comment} />);

		const editBtn = screen.getByTitle('postPage.comments.enterEditMode');
		await user.click(editBtn);

		const input = screen.getByPlaceholderText('fields.comment');
		await user.clear(input);
		await user.type(input, 'Успешно обновленный текст');

		const saveBtn = screen.getByRole('button', { name: 'comments.updateComment' });
		await user.click(saveBtn);

		await waitFor(() => {
			expect(mockUpdateComment).toHaveBeenCalledWith({
				variables: {
					commentId: 'comment-1',
					text: 'Успешно обновленный текст',
				},
			});
			// После onCompleted режим редактирования закрывается
			expect(screen.queryByPlaceholderText('fields.comment')).not.toBeInTheDocument();
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
