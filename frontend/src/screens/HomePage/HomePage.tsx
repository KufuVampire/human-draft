'use client';

import { useState } from 'react';

import { SEARCH_PARAMS } from '@/consts';
import { usePostsAndBlogs, useProfile } from '@/hooks';
import { CreatePostBlogLinks, PostsAndBlogsList, Section } from '@/shared';

export const HomePage = () => {
	const { isAuth } = useProfile();
	const [page] = useState(SEARCH_PARAMS.PAGE);
	const [perPage] = useState(SEARCH_PARAMS.PER_PAGE);
	const { postsAndBlogs } = usePostsAndBlogs({ page, perPage });

	return (
		<Section className='w-full md:py-0 flex flex-col gap-y-6'>
			{isAuth && <CreatePostBlogLinks />}
			{postsAndBlogs.length > 0 && <PostsAndBlogsList data={postsAndBlogs} />}
		</Section>
	);
};
