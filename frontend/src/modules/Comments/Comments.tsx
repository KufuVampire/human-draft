import { GetPostByIdQuery } from '@/graphql/generated/output';
import { CommentItem, CreateCommentField } from '@/shared';

interface Props {
	commentsList?: GetPostByIdQuery['getPostById']['comments'];
}

export const Comments = ({ commentsList }: Props) => {
	return (
		<>
			<CreateCommentField />
			<ul className='flex flex-col gap-y-3'>
				{commentsList?.map((comment) => (
					<CommentItem
						key={comment.id}
						comment={comment}
					/>
				))}
			</ul>
		</>
	);
};
