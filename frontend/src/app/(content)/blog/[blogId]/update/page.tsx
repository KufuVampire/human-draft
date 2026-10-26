import { notFound } from 'next/navigation';

import {
	GetBlogByIdDocument,
	GetBlogByIdQuery,
} from '@/graphql/generated/output';
import { AuthGuard } from '@/guards';
import { apolloClient } from '@/libs';
import { UpdateBlogPage } from '@/screens';
import { isNotFoundError } from '@/utils';

interface Params {
	params: Promise<{ blogId: string }>;
}

export default async function BlogUpdate({ params }: Params) {
	const { blogId } = await params;

	let blog: GetBlogByIdQuery['getBlogById'] | undefined;

	try {
		const { data } = await apolloClient.query<GetBlogByIdQuery>({
			query: GetBlogByIdDocument,
			variables: {
				blogId,
			},
		});

		blog = data?.getBlogById;
	} catch (err) {
		if (isNotFoundError(err)) {
			notFound();
		}
		throw err;
	}

	if (!blog) {
		notFound();
	}

	return (
		<AuthGuard>
			<UpdateBlogPage />
		</AuthGuard>
	);
}
