import { create } from 'zustand';

import { GetAllPostCommentsQuery } from './../graphql/generated/output';

interface InitialProps {
	comments: GetAllPostCommentsQuery['getAllPostComments'];
	setComments: (
		comments: GetAllPostCommentsQuery['getAllPostComments']
	) => void;
	getCommentsCount: () => number;
	deleteComment: (id: string) => void;
	addComment: (
		comment: GetAllPostCommentsQuery['getAllPostComments'][number]
	) => void;
	updateComment: (id: string, text: string) => void;
}

export const useComments = create<InitialProps>((set, get) => ({
	comments: [],
	getCommentsCount: () => {
		const { comments } = get();

		const getAllCommentsFlatArr = (
			commentsList: GetAllPostCommentsQuery['getAllPostComments']
		): GetAllPostCommentsQuery['getAllPostComments'] => {
			return commentsList.flatMap((comment) => [
				comment,
				...(comment.replies ? getAllCommentsFlatArr(comment.replies) : []),
			]);
		};

		return getAllCommentsFlatArr(comments).length;
	},
	setComments: (comments) => set({ comments }),
	deleteComment: (id: string) => {
		const { comments } = get();

		const removeComment = (
			commentsList: GetAllPostCommentsQuery['getAllPostComments']
		): GetAllPostCommentsQuery['getAllPostComments'] => {
			return commentsList
				.filter((comment) => comment.id !== id)
				.map((comment) => ({
					...comment,
					replies: comment.replies ? removeComment(comment.replies) : [],
				}));
		};

		const filteredComments = removeComment(comments);

		set({ comments: filteredComments });
	},
	addComment: (comment) => {
		const { comments } = get();

		const addReply = (
			commentsList: GetAllPostCommentsQuery['getAllPostComments']
		): GetAllPostCommentsQuery['getAllPostComments'] => {
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
			set({ comments: addReply(comments) });
			return;
		}

		set({ comments: [...comments, comment] });
	},
	updateComment: (id: string, text: string) => {
		const { comments } = get();

		const updateCommentInTree = (
			commentsList: GetAllPostCommentsQuery['getAllPostComments']
		): GetAllPostCommentsQuery['getAllPostComments'] => {
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

		set({ comments: updateCommentInTree(comments) });
	},
}));
