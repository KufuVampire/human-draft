import { GetAllPostCommentsQuery } from '@/graphql/generated/output';
import { CommentItem } from '@/shared';

interface Props {
	data: GetAllPostCommentsQuery['getAllPostComments'];
}

export const CommentsList = ({ data }: Props) => {
	return (
		<ul className='flex flex-col gap-y-3'>
			{data.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
				/>
			))}
		</ul>
	);
};
