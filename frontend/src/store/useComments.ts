import { create } from 'zustand';

import { GetAllPostCommentsQuery } from './../graphql/generated/output';

type CommentItemType = GetAllPostCommentsQuery['getAllPostComments'][number];

interface InitialProps {
	comments: GetAllPostCommentsQuery['getAllPostComments'];
	setComments: (
		comments: GetAllPostCommentsQuery['getAllPostComments']
	) => void;
	getCommentsCount: () => number;
	deleteComment: (id: string) => void;
	addComment: (newComment: CommentItemType) => void;
	updateComment: (id: string, text: string) => void;
}

export const useComments = create<InitialProps>((set, get) => ({
	comments: [],
	getCommentsCount: () => {
		const { comments } = get();

		const getAllCommentsFlatArr = (
			items: readonly { replies?: readonly any[] | null }[]
		): readonly unknown[] => {
			return items.flatMap((commentNode) => [
				commentNode,
				...(commentNode.replies ? getAllCommentsFlatArr(commentNode.replies) : []),
			]);
		};

		return getAllCommentsFlatArr(comments).length;
	},
	setComments: (comments) => set({ comments }),
	deleteComment: (id: string) => {
		const { comments } = get();

		const removeComment = <T extends { id: string; replies?: any[] | null }>(
			items: T[]
		): T[] => {
			return items
				.filter((commentNode) => commentNode.id !== id)
				.map((commentNode) => ({
					...commentNode,
					replies: commentNode.replies ? removeComment(commentNode.replies) : [],
				}));
		};

		set({ comments: removeComment(comments) });
	},
	addComment: (newComment) => {
		const { comments } = get();

		const addReply = <T extends { id: string; replies?: any[] | null }>(
			items: T[]
		): T[] => {
			return items.map((commentNode) => {
				if (commentNode.id === newComment.parentId) {
					return {
						...commentNode,
						replies: commentNode.replies
							? [...commentNode.replies, newComment]
							: [newComment],
					};
				}

				if (commentNode.replies?.length) {
					return {
						...commentNode,
						replies: addReply(commentNode.replies),
					};
				}

				return commentNode;
			});
		};

		if (newComment.parentId) {
			set({ comments: addReply(comments) });
			return;
		}

		set({ comments: [...comments, newComment] });
	},
	updateComment: (id: string, text: string) => {
		const { comments } = get();

		const updateCommentInTree = <
			T extends { id: string; text: string; replies?: any[] | null },
		>(
			items: T[]
		): T[] => {
			return items.map((commentNode) => {
				if (commentNode.id === id) {
					return {
						...commentNode,
						text,
					};
				}

				if (commentNode.replies?.length) {
					return {
						...commentNode,
						replies: updateCommentInTree(commentNode.replies),
					};
				}

				return commentNode;
			});
		};

		set({ comments: updateCommentInTree(comments) });
	},
}));
