import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UsersPage } from './UsersPage';

let mockQueryData: any = {
	getAllUsersPagination: {
		data: [
			{
				id: 'u-1',
				username: 'alice',
				description: 'Alice bio',
				avatarUrl: null,
			},
			{
				id: 'u-2',
				username: 'bob',
				description: 'Bob bio',
				avatarUrl: null,
			},
		],
		page: 1,
		perPage: 10,
		totalCount: 2,
		totalPages: 1,
	},
};
let mockLoading = false;

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

vi.mock('@/hooks', () => ({
	useDebounce: (v: string) => v,
	useProfile: () => ({
		subscriptions: [],
	}),
	useInfiniteScroll: vi.fn(() => vi.fn()),
}));

vi.mock('@/modules', () => ({
	SubscribeUnsubscribeButtons: () => <button>Subscribe</button>,
}));

vi.mock('@/graphql/generated/output', () => ({
	useGetAllUsersQuery: () => ({
		data: mockQueryData,
		loading: mockLoading,
	}),
}));

vi.mock('@/shared', () => ({
	Section: ({ children }: any) => <div>{children}</div>,
	FormField: ({ children, wrapperClassNames: _w, inputWrapperClassName: _i, ...props }: any) => (
		<div>
			<input {...props} />
			{children}
		</div>
	),
	UserAvatar: ({ username }: any) => <div>Avatar for {username}</div>,
	UserAvatarSkeleton: () => <div>AvatarSkeleton</div>,
	Skeleton: () => <div>Skeleton</div>,
	CustomLink: ({ children, href, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

describe('UsersPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLoading = false;
		mockQueryData = {
			getAllUsersPagination: {
				data: [
					{
						id: 'u-1',
						username: 'alice',
						description: 'Alice bio',
						avatarUrl: null,
					},
					{
						id: 'u-2',
						username: 'bob',
						description: 'Bob bio',
						avatarUrl: null,
					},
				],
				page: 1,
				perPage: 10,
				totalCount: 2,
				totalPages: 1,
			},
		};
	});

	it('renders user cards with absolute links /:username (not relative)', () => {
		render(<UsersPage />);

		const aliceLink = screen.getByRole('link', { name: /alice/i });
		const bobLink = screen.getByRole('link', { name: /bob/i });

		expect(aliceLink).toHaveAttribute('href', '/alice');
		expect(bobLink).toHaveAttribute('href', '/bob');
	});

	it('shows loading skeletons when initial page is loading', () => {
		mockLoading = true;
		mockQueryData = null;

		render(<UsersPage />);

		expect(screen.getAllByText('AvatarSkeleton').length).toBeGreaterThan(0);
	});
});
