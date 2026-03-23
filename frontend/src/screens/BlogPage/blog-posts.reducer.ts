import { GetBlogByIdQuery } from '@/graphql/generated/output';

type Post = GetBlogByIdQuery['getBlogById']['posts'][number];

type Action =
	| { type: 'INIT'; payload: Post[] }
	| { type: 'PIN'; payload: Post }
	| { type: 'UNPIN'; payload: { postId: string } }
	| { type: 'DELETE'; payload: { postId: string } };

const sortPosts = (posts: Post[]) =>
	posts
		.slice()
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

export function blogPostsReducer(state: Post[], action: Action): Post[] {
	switch (action.type) {
		case 'INIT':
			return sortPosts(action.payload);

		case 'PIN': {
			return sortPosts([
				...state.filter((p) => p.id !== action.payload.id),
				action.payload,
			]);
		}

		case 'UNPIN':
		case 'DELETE': {
			const index = state.findIndex((p) => p.id === action.payload.postId);
			if (index === -1) return state;

			return [...state.slice(0, index), ...state.slice(index + 1)];
		}

		default:
			return state;
	}
}
