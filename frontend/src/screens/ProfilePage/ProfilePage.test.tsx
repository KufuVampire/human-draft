import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProfilePage } from './ProfilePage';

let mockProfileUsername: string | undefined = 'alice';
let mockQueryData: {
	getUserByUsername?: {
		id: string;
		username: string;
		email: string;
		posterUrl: string | null;
		avatarUrl: string | null;
		description: string | null;
		createdAt: string;
		posts: Array<{
			id: string;
			title: string;
			createdAt: string;
			viewsCount: number;
			commentsCount: number;
			isLiked: boolean;
		}>;
		blogs: Array<{
			id: string;
			title: string;
			createdAt: string;
			posterUrl: string | null;
		}>;
	} | null;
} = {};
let mockQueryLoading = false;
const mockNotFound = vi.fn();

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
	notFound: () => mockNotFound(),
}));

vi.mock('@/hooks', () => ({
	useProfile: () => ({
		profile: mockProfileUsername ? { username: mockProfileUsername } : null,
		subscriptions: [],
		changePosterLoading: false,
		removePosterLoading: false,
		isAvatarChanging: false,
		isAvatarRemoving: false,
		handleLoadPoster: vi.fn(),
		handleRemovePoster: vi.fn(),
		handleRemoveAvatar: vi.fn(),
		handleChangeAvatar: vi.fn(),
	}),
}));

vi.mock('@/graphql/generated/output', () => ({
	useGetUserByUsernameQuery: () => ({
		data: mockQueryData,
		loading: mockQueryLoading,
	}),
}));

vi.mock('@/shared', () => ({
	CreatePostBlogLinks: () => (
		<div data-testid='create-post-blog-links'>CreatePostBlogLinks</div>
	),
	ProfilePageSkeleton: () => (
		<div data-testid='profile-skeleton'>Loading Skeleton</div>
	),
	Section: ({ children }: { children: React.ReactNode }) => (
		<section>{children}</section>
	),
	Dropdown: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	Button: ({ children }: { children: React.ReactNode }) => (
		<button>{children}</button>
	),
	CustomLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
	UserAvatar: () => <div data-testid='user-avatar'>Avatar</div>,
	PostsAndBlogsList: () => <div data-testid='posts-list'>Posts List</div>,
}));

vi.mock('@/modules', () => ({
	SubscribeUnsubscribeButtons: () => <div>Subscribe</div>,
}));

vi.mock('./ProfilePoster/ProfilePoster', () => ({
	ProfilePoster: ({ children }: { children?: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

describe('ProfilePage component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockProfileUsername = 'alice';
		mockQueryLoading = false;
		mockQueryData = {
			getUserByUsername: {
				id: 'user-1',
				username: 'alice',
				email: 'alice@example.com',
				posterUrl: null,
				avatarUrl: null,
				description: 'Hello world',
				createdAt: new Date().toISOString(),
				posts: [],
				blogs: [],
			},
		};
	});

	it('renders CreatePostBlogLinks when current user is profile owner', () => {
		mockProfileUsername = 'alice';
		render(<ProfilePage username='alice' />);

		expect(screen.getByTestId('create-post-blog-links')).toBeInTheDocument();
	});

	it('hides CreatePostBlogLinks when viewing another user profile', () => {
		mockProfileUsername = 'alice';
		mockQueryData = {
			getUserByUsername: {
				id: 'user-2',
				username: 'bob',
				email: 'bob@example.com',
				posterUrl: null,
				avatarUrl: null,
				description: 'Bob bio',
				createdAt: new Date().toISOString(),
				posts: [],
				blogs: [],
			},
		};

		render(<ProfilePage username='bob' />);

		expect(screen.queryByTestId('create-post-blog-links')).not.toBeInTheDocument();
	});

	it('calls notFound when user is not found and query finished loading', () => {
		mockQueryData = { getUserByUsername: null };
		mockQueryLoading = false;

		render(<ProfilePage username='nonexistent' />);

		expect(mockNotFound).toHaveBeenCalled();
	});
});
