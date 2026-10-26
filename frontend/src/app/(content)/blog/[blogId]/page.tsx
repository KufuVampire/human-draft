import { type Metadata } from 'next';

import { routesConfig } from '@/config';
import {
	GetBlogByIdDocument,
	GetBlogByIdQuery,
} from '@/graphql/generated/output';
import { apolloClient } from '@/libs';
import { BlogPage } from '@/screens';
import { isNotFoundError } from '@/utils';

interface Params {
	params: Promise<{ blogId: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { blogId } = await params;

	let blog: GetBlogByIdQuery['getBlogById'] | undefined;

	try {
		const { data }: { data: GetBlogByIdQuery } = await apolloClient.query({
			query: GetBlogByIdDocument,
			variables: {
				blogId,
			},
		});

		blog = data?.getBlogById;
	} catch (err) {
		if (isNotFoundError(err)) {
			return {
				title: 'Страница не найдена',
			};
		}
		throw err;
	}

	if (!blog) {
		return {
			title: 'Страница не найдена',
		};
	}

	return {
		title: blog.title,
		authors: [
			{
				name: blog.author.username,
				url: routesConfig.profileUsername(blog.author.username),
			},
		],
		openGraph: {
			type: 'article',
			title: blog.title,
			authors: [blog.author.username],
			publishedTime: new Date(blog.createdAt).toString(),
			siteName: 'HUMAN DRAFT',
			tags: blog.tags.map((t) => t.name),
			url: `https://human-draft.com/blog/${blog.id}`,
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
