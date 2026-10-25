import { create } from 'zustand';

import { GetAllPostCommentsQuery } from './../graphql/generated/output';

type CommentItemType = GetAllPostCommentsQuery['getAllPostComments'][number];

type CommentTreeItem = {
	id: string;
	text: string;
	parentId?: string | null;
	replies?: CommentTreeItem[] | null;
	[key: string]: unknown;
};

interface InitialProps {
	comments: GetAllPostCommentsQuery['getAllPostComments'];
	setComments: (
		comments: GetAllPostCommentsQuery['getAllPostComments']
	) => void;
	getCommentsCount: () => number;
	deleteComment: (id: string) => void;
	addComment: (comment: CommentItemType) => void;
	updateComment: (id: string, text: string) => void;
}

export const useComments = create<InitialProps>((set, get) => ({
	comments: [],
	getCommentsCount: () => {
		const { comments } = get();

		const getAllCommentsFlatArr = (
			commentsList: readonly CommentTreeItem[]
		): readonly CommentTreeItem[] => {
			return commentsList.flatMap((comment) => [
				comment,
				...(comment.replies ? getAllCommentsFlatArr(comment.replies) : []),
			]);
		};

		return getAllCommentsFlatArr(comments as unknown as CommentTreeItem[]).length;
	},
	setComments: (comments) => set({ comments }),
	deleteComment: (id: string) => {
		const { comments } = get();

		const removeComment = <T extends CommentTreeItem>(commentsList: T[]): T[] => {
			return commentsList
				.filter((comment) => comment.id !== id)
				.map((comment) => ({
					...comment,
					replies: comment.replies ? removeComment(comment.replies) : [],
				}));
		};

		const filteredComments = removeComment(
			comments as unknown as CommentTreeItem[]
		);

		set({
			comments: filteredComments as GetAllPostCommentsQuery['getAllPostComments'],
		});
	},
	addComment: (comment) => {
		const { comments } = get();

		const addReply = <T extends CommentTreeItem>(commentsList: T[]): T[] => {
			return commentsList.map((c) => {
				if (c.id === comment.parentId) {
					return {
						...c,
						replies: c.replies ? [...c.replies, comment] : [comment],
					};
				}

				if (c.replies?.length) {
					return {
						...c,
						replies: addReply(c.replies),
					};
				}

				return c;
			});
		};

		if (comment.parentId) {
			set({
				comments: addReply(
					comments as unknown as CommentTreeItem[]
				) as GetAllPostCommentsQuery['getAllPostComments'],
			});
			return;
		}

		set({ comments: [...comments, comment] });
	},
	updateComment: (id: string, text: string) => {
		const { comments } = get();

		const updateCommentInTree = <T extends CommentTreeItem>(
			commentsList: T[]
		): T[] => {
			return commentsList.map((c) => {
				if (c.id === id) {
					return {
						...c,
						text,
					};
				}

				if (c.replies?.length) {
					return {
						...c,
						replies: updateCommentInTree(c.replies),
					};
				}

				return c;
			});
		};

		const updated = updateCommentInTree(
			comments as unknown as CommentTreeItem[]
		);

		set({
			comments: updated as GetAllPostCommentsQuery['getAllPostComments'],
		});
	},
}));
