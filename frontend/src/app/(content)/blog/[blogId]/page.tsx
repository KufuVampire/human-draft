import { Metadata } from 'next';

import { routesConfig } from '@/config';
import {
	GetBlogByIdDocument,
	GetBlogByIdQuery,
} from '@/graphql/generated/output';
import { apolloClient } from '@/libs';
import { BlogPage } from '@/screens';

interface Params {
	params: Promise<{ blogId: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { blogId } = await params;

	const { data }: { data: GetBlogByIdQuery } = await apolloClient.query({
		query: GetBlogByIdDocument,
		variables: {
			blogId,
		},
	});

	const post = data.getBlogById;

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

export default function Blog() {
	return <BlogPage />;
}
