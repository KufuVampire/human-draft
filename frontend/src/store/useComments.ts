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
			items: readonly { replies?: unknown }[]
		): readonly unknown[] => {
			return items.flatMap((commentNode) => [
				commentNode,
				...(Array.isArray(commentNode.replies)
					? getAllCommentsFlatArr(commentNode.replies)
					: []),
			]);
		};

		return getAllCommentsFlatArr(comments).length;
	},
	setComments: (comments) => set({ comments }),
	deleteComment: (id: string) => {
		const { comments } = get();

		const removeComment = <T extends { id: string; replies?: unknown }>(
			items: T[]
		): T[] => {
			return items
				.filter((commentNode) => commentNode.id !== id)
				.map((commentNode) => ({
					...commentNode,
					...(Array.isArray(commentNode.replies)
						? { replies: removeComment(commentNode.replies) }
						: {}),
				}));
		};

		set({ comments: removeComment(comments) });
	},
	addComment: (newComment) => {
		const { comments } = get();

		const addReply = <T extends { id: string; replies?: unknown }>(
			items: T[]
		): T[] => {
			return items.map((commentNode) => {
				if (commentNode.id === newComment.parentId) {
					const existingReplies = Array.isArray(commentNode.replies)
						? commentNode.replies
						: [];
					return {
						...commentNode,
						replies: [...existingReplies, newComment],
					};
				}

				if (Array.isArray(commentNode.replies) && commentNode.replies.length) {
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
			T extends { id: string; text: string; replies?: unknown },
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

				if (Array.isArray(commentNode.replies) && commentNode.replies.length) {
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
