'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { useComments } from '@/store/useComments';

import { useGetAllPostCommentsLazyQuery } from '@/graphql/generated/output';
import { CommentsList, CreateCommentField } from '@/shared';

const Comments = () => {
	const { postId } = useParams<{ postId: string }>();
	const { comments, setComments } = useComments();
	const [getComments, { data }] = useGetAllPostCommentsLazyQuery();

	useEffect(() => {
		if (!postId) return;
		getComments({ variables: { postId } });
	}, [postId]);

	useEffect(() => {
		if (data && data.getAllPostComments) {
			setComments(data.getAllPostComments);
		}
	}, [data]);

	return (
		<>
			<CreateCommentField />
			{comments.length > 0 && <CommentsList data={comments} />}
		</>
	);
};

export default Comments;
