import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

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

const getBlog = cache(async (blogId: string) => {
	try {
		const { data }: { data: GetBlogByIdQuery } = await apolloClient.query({
			query: GetBlogByIdDocument,
			variables: {
				blogId,
			},
		});

		return data?.getBlogById;
	} catch (err) {
		if (isNotFoundError(err)) {
			return null;
		}
		throw err;
	}
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { blogId } = await params;
	const blog = await getBlog(blogId);

	if (!blog) {
		notFound();
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

export default async function Blog({ params }: Params) {
	const { blogId } = await params;
	const blog = await getBlog(blogId);

	if (!blog) {
		notFound();
	}

	return <BlogPage initialData={blog} />;
}
