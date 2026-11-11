'use client';

import { notFound, useParams } from 'next/navigation';
import {
	memo,
	useEffect,
	useReducer,
	useState,
} from 'react';
import { useForm } from 'react-hook-form';

import { blogPostsReducer } from './blog-posts.reducer';
import { BlogHeader } from './components/BlogHeader';
import { BlogOwnerBar } from './components/BlogOwnerBar';
import { useBlogOperations } from './hooks/useBlogOperations';
import { useBlogPinDropdown } from './hooks/useBlogPinDropdown';
import { routesConfig } from '@/config';
import {
	GetBlogByIdQuery,
	useGetAllFreePostsForPinQuery,
} from '@/graphql/generated/output';
import { useBlog, useBlobUrl } from '@/hooks';
import { TypeSearchSchema } from '@/schemas';
import { CreatePostLink, PostsAndBlogsList } from '@/shared';
import { useProfileStore } from '@/store';
import { isNotFoundError } from '@/utils';

interface Props {
	initialData?: GetBlogByIdQuery['getBlogById'];
}

export const BlogPage = memo(({ initialData }: Props = {}) => {
	const { blogId } = useParams<{ blogId: string }>();
	const [blogPosts, dispatch] = useReducer(
		blogPostsReducer,
		initialData?.posts ?? []
	);
	const [posterFile, setPosterFile] = useState<File | null>(null);
	const posterBlobUrl = useBlobUrl(posterFile);
	const [posterUrl, setPosterUrl] = useState<string | null>(
		initialData?.posterUrl ?? null
	);
	const [isOpen, setOpen] = useState(false);
	const profile = useProfileStore((s) => s.profile);

	const { register, watch } = useForm<TypeSearchSchema>({
		defaultValues: {
			search: '',
		},
	});

	const { data, loading: isBlogLoading, error } = useBlog(blogId, initialData);
	const { data: postsData, refetch } = useGetAllFreePostsForPinQuery({
		skip: !isOpen,
	});

	const blog = data?.getBlogById;

	useEffect(() => {
		if (blog) {
			dispatch({
				type: 'INIT',
				payload: blog.posts,
			});
			if (blog.posterUrl) {
				setPosterUrl(blog.posterUrl);
			}
		}
	}, [blog]);

	const {
		pinPosts,
		unpinPosts,
		isPosterUpdating,
		isPosterDeleting,
		handleDeletePost,
		handleDeleteBlog,
		handleChangePoster,
		handleDeletePoster,
	} = useBlogOperations({
		blogId,
		dispatch,
		refetch,
		setPosterFile,
		setPosterUrl,
	});

	const { dropdownAllItems, handleTogglePin } = useBlogPinDropdown({
		blogId,
		blogPosts,
		freePosts: postsData?.getFreePostsForPin,
		register,
		watch,
		onPinPost: (postId) => pinPosts({ variables: { blogId, postId } }),
		onUnpinPost: (postId) => unpinPosts({ variables: { blogId, postId } }),
	});

	useEffect(() => {
		if (isBlogLoading) return;
		if (error) {
			if (isNotFoundError(error)) notFound();
			return;
		}
		if (!data || !blog) notFound();
	}, [isBlogLoading, data, blog, error]);

	if (error && !isNotFoundError(error)) throw error;
	if (isBlogLoading || !blog) return null;

	const isOwner = profile?.username === blog.author.username;
	const currentPosterUrl = posterBlobUrl || posterUrl;

	return (
		<div className='flex flex-col gap-y-6 w-full'>
			<BlogHeader
				title={blog.title}
				description={blog.description}
				tags={blog.tags}
				currentPosterUrl={currentPosterUrl}
				isOwner={isOwner}
				isPosterUpdating={isPosterUpdating}
				isPosterDeleting={isPosterDeleting}
				onChangePoster={handleChangePoster}
				onDeletePoster={handleDeletePoster}
			/>
			{isOwner && (
				<BlogOwnerBar
					blogId={blogId}
					isOpen={isOpen}
					setOpen={setOpen}
					items={dropdownAllItems}
					onTogglePin={handleTogglePin}
					onDeleteBlog={handleDeleteBlog}
				/>
			)}
			{isOwner && (
				<CreatePostLink href={routesConfig.postCreateWithBlog(blogId)} />
			)}
			<PostsAndBlogsList
				onClick={handleDeletePost}
				data={blogPosts}
				isBlogPage
			/>
		</div>
	);
});

BlogPage.displayName = 'BlogPage';
