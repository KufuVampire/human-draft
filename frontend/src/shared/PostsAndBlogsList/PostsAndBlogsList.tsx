import { MouseEvent } from 'react';

import { BlogCard } from '../BlogCard/BlogCard';
import { PostCard } from '../PostCard/PostCard';

import {
	BlogModel,
	GetAllBlogsQuery,
	GetAllPostsQuery,
	PostModel,
} from '@/graphql/generated/output';

interface Props {
	data: (
		| GetAllPostsQuery['getAllPostsPagination']['data'][number]
		| GetAllBlogsQuery['getAllBlogsPagination']['data'][number]
		| PostModel
		| BlogModel
	)[];
	isBlogPage?: boolean;
	onClick?: (e: MouseEvent<HTMLUListElement>) => void;
}

export const PostsAndBlogsList = ({
	data,
	isBlogPage = false,
	onClick,
}: Props) => {
	return (
		<ul
			className='columns-1 lg:columns-2 gap-6'
			onClick={onClick}>
			{data.map((o) => {
				if (o.__typename === 'BlogModel') {
					return (
						<BlogCard
							key={o.id}
							id={o.id}
							title={o.title}
							description={o.description}
							posterUrl={o.posterUrl}
							createdAt={o.createdAt}
							author={o.author}
							tags={o.tags}
						/>
					);
				}

				if (o.__typename === 'PostModel') {
					return (
						<PostCard
							key={o.id}
							id={o.id}
							title={o.title}
							content={o.content}
							createdAt={o.createdAt}
							author={o.author}
							tags={o.tags}
							isBlogPage={isBlogPage}
						/>
					);
				}
			})}
		</ul>
	);
};
