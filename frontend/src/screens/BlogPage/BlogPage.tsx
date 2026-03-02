'use client';

import { ChevronDown, Search, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { routesConfig } from '@/config';
import {
	GetBlogByIdQuery,
	useChangeBlogPosterMutation,
	useDeleteBlogMutation,
	useDeleteBlogPosterMutation,
	useDeletePostMutation,
	useGetAllFreePostsForPinQuery,
	useGetBlogByIdQuery,
	usePinPostMutation,
	useUnPinPostMutation,
} from '@/graphql/generated/output';
import { useDebounce, useProfile } from '@/hooks';
import { TypeSearchSchema } from '@/schemas';
import {
	Button,
	CreatePostLink,
	CustomLink,
	Dropdown,
	FormField,
	PostsAndBlogsList,
	Section,
	TagsList,
} from '@/shared';
import { useConfirmationDeletionModal } from '@/store';
import { cn } from '@/utils';

const btnStyles = 'px-3 py-2 leading-[150%] font-bold rounded-lg';

export const BlogPage = () => {
	const { blogId } = useParams<{ blogId: string }>();
	const [posterFile, setPosterFile] = useState<File | null>(null);
	const [posterUrl, setPosterUrl] = useState<string | null>(null);
	const [isOpen, setOpen] = useState(false);
	const [blogPosts, setBlogPosts] = useState<
		GetBlogByIdQuery['getBlogById']['posts']
	>([]);
	const { isAuth, profile } = useProfile();
	const t = useTranslations();

	const {
		setType,
		setCb,
		setOpen: setModalOpen,
	} = useConfirmationDeletionModal();

	const { register, watch } = useForm<TypeSearchSchema>({
		defaultValues: {
			search: '',
		},
	});

	const { data, loading: isBlogLoading } = useGetBlogByIdQuery({
		variables: {
			blogId,
		},
	});
	const { data: freePosts } = useGetAllFreePostsForPinQuery({
		skip: !isOpen,
	});

	useEffect(() => {
		if (data && data.getBlogById) {
			setBlogPosts(data.getBlogById.posts);
		}
		if (data && data.getBlogById.posterUrl) {
			setPosterUrl(data.getBlogById.posterUrl);
		}
	}, [data]);

	const postsSearchStr = useDebounce(watch('search') || '');

	const [pinPosts] = usePinPostMutation({
		onCompleted(data) {
			setBlogPosts((prev) =>
				[...prev, data.pinPost].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
			);
		},
	});
	const [unpinPosts] = useUnPinPostMutation({
		onCompleted(data) {
			setBlogPosts((prev) =>
				prev.filter((p) => p.id !== data.unPinPost.postId)
			);
		},
	});
	const [deletePost] = useDeletePostMutation({
		onCompleted(data) {
			toast.success(t('postPage.postDeletedSuccess'));
			setBlogPosts((prev) =>
				prev.filter((p) => p.id !== data.deletePost.postId)
			);
		},
	});
	const [deleteBlog] = useDeleteBlogMutation({
		onCompleted() {
			toast.success(t('blogPage.blogDeletedSuccess'));
			redirect(routesConfig.home);
		},
	});
	const [updatePoster, { loading: isPosterUpdating }] =
		useChangeBlogPosterMutation({
			onCompleted() {
				if (posterFile) {
					setPosterUrl(URL.createObjectURL(posterFile));
					toast.success(t('blogPage.poster.updated'));
				}
			},
			onError(err) {
				console.error(err);
			},
		});
	const [deletePoster, { loading: isPosterDeleting }] =
		useDeleteBlogPosterMutation({
			onCompleted() {
				toast.success(t('blogPage.poster.deleted'));
			},
		});

	if (!blogId || (!isBlogLoading && !data)) {
		redirect(routesConfig.notFound);
	}

	if (isBlogLoading) {
		return;
	}

	const blog = data?.getBlogById;

	if (!blog) {
		redirect(routesConfig.notFound);
	}

	const posts = [...(freePosts?.getFreePostsForPin || []), ...blogPosts];

	const dropdownItems = posts
		.filter((p) =>
			p.title.toLowerCase().includes(postsSearchStr.toLowerCase().trim())
		)
		.map(({ id, title }) => (
			<FormField
				key={id}
				type='checkbox'
				data-post={id}
				text={title}
				wrapperClassNames='w-full justify-end bg-[var(--background-color-card)]'
				defaultChecked={blog.posts.some((p) => p.id === id)}
			/>
		));

	const drodownSearchField = (
		<FormField
			{...register('search')}
			placeholder={t('blogPage.pinPosts.searchFieldPlaceholder')}
			className='border-none [&:not(:placeholder-shown)]:shadow-none p-0 rounded-none'
			wrapperClassNames='w-full border border-primary p-2 rounded-sm'
			inputWrapperClassName='flex items-center justify-between flex-row-reverse'>
			<Search />
		</FormField>
	);

	const handleTogglePin = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const checkbox = target.closest('input');

		if (!checkbox) return;

		const postId = checkbox.dataset.post;

		if (!postId) return;

		if (checkbox.checked) {
			pinPosts({
				variables: {
					blogId,
					postId,
				},
			});
			return;
		}

		unpinPosts({
			variables: {
				blogId,
				postId,
			},
		});
	};

	const handleRemovePost = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const button = target.closest('button');

		if (!button) return;

		const postId = button.dataset.post;

		if (!postId) return;

		setType('post');
		setCb(() => {
			deletePost({
				variables: {
					postId,
				},
			});
			setModalOpen(false);
		});
		setModalOpen(true);
	};

	const handleRemoveBlog = () => {
		setType('blog');
		setCb(() => {
			deleteBlog({});
			setModalOpen(false);
		});
		setModalOpen(true);
	};

	const handleChangePoster = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		console.log(e.target.files);
		if (!file) return;
		setPosterFile(file);
		updatePoster({
			variables: {
				blogId,
				posterFile: file,
			},
		});
		e.target.value = '';
	};

	const handleDeletePoster = () => {
		setType('poster');
		setCb(() => {
			setPosterUrl(null);
			deletePoster({
				variables: {
					blogId,
				},
			});
			setModalOpen(false);
		});
		setModalOpen(true);
	};

	return (
		<div className='flex flex-col gap-y-6 w-full'>
			<Section
				className='py-0 md:py-0 relative overflow-hidden rounded-xl bg-placeholder before:absolute before:inset-0 before:bg-[rgba(0,0,0,0.4)] before:z-0 bg-no-repeat bg-size-[100%_330px]'
				style={
					posterUrl
						? {
								backgroundImage: `url(${posterUrl})`,
							}
						: undefined
				}>
				<div className='w-full p-3 pt-16 md:p-6 md:pt-10 z-10 relative min-h-82.5 flex flex-col justify-between'>
					<div className='w-full flex flex-col gap-y-7.5 md:gap-y-12'>
						<h1 className='font-title font-bold text-[1.75rem] md:text-5xl leading-[110%] w-full text-center text-secondary'>
							{blog.title}
						</h1>
						<div className='flex flex-col gap-y-4'>
							<p className='leading-[150%] tracking-[2%] text-secondary'>
								{blog.description}
							</p>
							<TagsList
								tags={blog.tags}
								location='blog'
							/>
						</div>
					</div>
					{isAuth && profile?.username === blog.author.username && (
						<div className='flex gap-x-2 self-end'>
							<label className='text-secondary px-3 rounded-lg leading-6 backdrop-blur-disabled hover:text-primary-hover focus-visible:text-primary-hover cursor-pointer transition-colors text-left z-10 relative bg-disabled py-2'>
								{t('btns.editPoster')}
								<input
									type='file'
									className='hidden'
									onChange={handleChangePoster}
									disabled={isPosterDeleting || isPosterUpdating}
								/>
							</label>
							{posterUrl && (
								<Button
									variant='light'
									className='p-2 rounded-lg'
									onClick={handleDeletePoster}>
									<Trash />
								</Button>
							)}
						</div>
					)}
				</div>
			</Section>
			<div className='flex flex-col-reverse md:flex-row gap-2'>
				<Dropdown
					isOpen={isOpen}
					items={[drodownSearchField, ...dropdownItems]}
					setOpen={setOpen}
					className='w-full'
					listClassName='w-full top-[calc(100%+0.5rem)] overflow-hidden py-3 px-2.5 shadow-secondary min-w-auto'
					onClick={handleTogglePin}
					displayDirection='top'>
					<Button
						variant='secondary'
						className='bg-[var(--background-color-card)] px-5 py-2 flex gap-x-5 rounded-lg w-full'
						onClick={() => setOpen((prev) => !prev)}>
						<span className='w-full inline-block text-left'>
							{t('blogPage.pinPosts.pin')}
						</span>
						<ChevronDown
							className={cn(
								'transition-transform shrink-0',
								isOpen && 'rotate-180'
							)}
						/>
					</Button>
				</Dropdown>
				<div className='flex gap-x-2'>
					<Button
						variant='secondary'
						className={btnStyles}
						onClick={handleRemoveBlog}>
						{t('btns.remove')}
					</Button>
					<CustomLink
						href={routesConfig.blogUpdate(blogId)}
						variant='primary'
						className={cn(btnStyles, 'text-nowrap w-full md:w-auto')}>
						{t('blogPage.editBlog')}
					</CustomLink>
				</div>
			</div>
			<CreatePostLink href={routesConfig.postCreateWithBlog(blogId)} />
			<PostsAndBlogsList
				onClick={handleRemovePost}
				data={blogPosts
					.slice()
					.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					)}
				isBlogPage
			/>
		</div>
	);
};
