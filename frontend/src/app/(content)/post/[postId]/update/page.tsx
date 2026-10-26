import { notFound } from 'next/navigation';

import {
	GetPostByIdDocument,
	GetPostByIdQuery,
} from '@/graphql/generated/output';
import { AuthGuard } from '@/guards';
import { apolloClient } from '@/libs';
import { UpdatePostPage } from '@/screens';
import { isNotFoundError } from '@/utils';

interface Params {
	params: Promise<{ postId: string }>;
}

export default async function PostUpdate({ params }: Params) {
	const { postId } = await params;

	let post: GetPostByIdQuery['getPostById'] | undefined;

	try {
		const { data } = await apolloClient.query<GetPostByIdQuery>({
			query: GetPostByIdDocument,
			variables: {
				postId,
			},
		});

		post = data?.getPostById;
	} catch (err) {
		if (isNotFoundError(err)) {
			notFound();
		}
		throw err;
	}

	if (!post) {
		notFound();
	}

	return (
		<AuthGuard>
			<UpdatePostPage />
		</AuthGuard>
	);
}
