import { type Metadata } from 'next';

import { routesConfig } from '@/config';
import {
	GetPostByIdDocument,
	GetPostByIdQuery,
} from '@/graphql/generated/output';
import { apolloClient } from '@/libs';
import { PostPage } from '@/screens';

interface Params {
	params: Promise<{ postId: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { postId } = await params;

	const { data }: { data: GetPostByIdQuery } = await apolloClient.query({
		query: GetPostByIdDocument,
		variables: {
			postId,
		},
	});

	const post = data.getPostById;

	return {
		title: post.title,
		authors: [
			{
				name: post.author.username,
				url: routesConfig.profileUsername(post.author.username),
			},
		],
		openGraph: {
			type: 'article',
			title: post.title,
			authors: [post.author.username],
			publishedTime: new Date(post.createdAt).toString(),
			siteName: 'HUMAN DRAFT',
			tags: post.tags.map((t) => t.name),
			url: `https://human-draft.com/post/${post.id}`,
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}

export default function Post() {
	return <PostPage />;
}
