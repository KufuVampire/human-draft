'use client';

import { useState } from 'react';

import { SEARCH_PARAMS } from '@/consts';
import { useGetAllPostsQuery } from '@/graphql/generated/output';
import { CreatePostBlogLinks, PostCard, Section } from '@/shared';

export const HomePage = () => {
	const [page] = useState(SEARCH_PARAMS.PAGE);
	const [perPage] = useState(SEARCH_PARAMS.PER_PAGE);

	const { data } = useGetAllPostsQuery({
		variables: { searchParams: { page, perPage } },
	});

	const posts = data?.getAllPostsPagination;
	const sortedPosts = posts?.data
		.slice()
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		return (
		<Section className='w-full md:py-0 flex flex-col gap-y-6'>
			<CreatePostBlogLinks />
			<ul className='columns-1 lg:columns-2 gap-6'>
				{sortedPosts?.map((post) => {
					return (
						<PostCard
							key={post.id}
							author={post.author}
							createdAt={post.createdAt}
							id={post.id}
							title={post.title}
							content={post.content}
							tags={post.tags}
						/>
					);
				})}
			</ul>
		</Section>
	);
};
