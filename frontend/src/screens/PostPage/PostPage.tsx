'use client';

import { ChevronDown, Eye, Heart, MessageSquare, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import {
	MouseEvent,
	lazy,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { routesConfig } from '@/config';
import {
	GetPostByIdDocument,
	useDeletePostMutation,
	useGetBlogsForPinQuery,
	useTogglePinBlogMutation,
	useUpdatePostMutation,
} from '@/graphql/generated/output';
import { useDebounce, useLocalStorage, usePost } from '@/hooks';
import { TypeSearchSchema } from '@/schemas';
import {
	Button,
	CustomLink,
	Dropdown,
	FormField,
	MilkdownContent,
	TagsList,
	UserBadgeWithCreatedAt,
} from '@/shared';
import {
	useComments,
	useConfirmationDeletionModal,
	useNeedAuthModal,
	useProfile,
} from '@/store';
import { cn } from '@/utils';

const isLikeExpired = (date: number) => {
	if (!date) return true;

	const now = Date.now();
	const diff = now - date;

	return diff >= 24 * 60 * 60 * 1000;
};

interface ILikedAt {
	postId: string;
	date: number;
	isLiked: boolean;
	userId: string | null;
}

const CommentsLazy = lazy(() => import('@/modules/Comments/Comments'));

export const PostPage = () => {
	const t = useTranslations();
	const { postId } = useParams<{ postId: string }>();
	const { profile, isAuth } = useProfile();
	const [likedAt, setLikedAt] = useLocalStorage<ILikedAt[]>(`likedAt`, []);
	const { getCommentsCount } = useComments();
	const { setOpen, setType, setCb } = useConfirmationDeletionModal();
	const { setOpen: setNeedAuthOpen } = useNeedAuthModal();
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [pinnedBlogId, setPinnedBlogId] = useState<string | null>(null);
	const { register, watch } = useForm<TypeSearchSchema>({
		defaultValues: {
			search: '',
		},
	});
	const {
		isLoading,
		content,
		author,
		createdAt,
		tags,
		likesCount,
		viewsCount,
		blog,
	} = usePost(postId);

	const isOwner = profile?.username === author?.username;

	const { data } = useGetBlogsForPinQuery({
		skip: !isDropdownOpen,
	});
	const [deletePost] = useDeletePostMutation({
		onCompleted() {
			toast.success(t('postPage.postDeletedSuccess'));
			redirect(routesConfig.home);
		},
	});
	const [updatePost, { loading: isUpdating }] = useUpdatePostMutation({
		refetchQueries: [
			{
				query: GetPostByIdDocument,
				variables: { postId },
			},
		],
		awaitRefetchQueries: true,
	});
	const [togglePin] = useTogglePinBlogMutation({
		onCompleted(data) {
			if (data.pinPostToBlog.blog) {
				setPinnedBlogId(data.pinPostToBlog.blog.id);
			}
		},
	});

	useEffect(() => {
		if (blog) {
			setPinnedBlogId(blog.id);
		}
	}, [blog]);

	useEffect(() => {
		if (isLoading) return;
		const timer = setTimeout(() => {
			updatePost({
				variables: {
					postId,
					data: {
						viewsCount: viewsCount ? viewsCount + 1 : 1,
					},
				},
			});
		}, 10000);
		return () => clearTimeout(timer);
	}, [isLoading]);

	const searchStr = useDebounce(watch('search'));

	const drodownSearchField = useMemo(
		() => (
			<FormField
				{...register('search')}
				placeholder={t('blogPage.pinPosts.searchFieldPlaceholder')}
				className='border-none [&:not(:placeholder-shown)]:shadow-none p-0 rounded-none'
				wrapperClassNames='w-full border border-primary p-2 rounded-sm'
				inputWrapperClassName='flex items-center justify-between flex-row-reverse'>
				<Search />
			</FormField>
		),
		[register, t]
	);
	const dropdownItems = useMemo(() => {
		const blogs = data?.blogsForPin || [];
		const normalizedSearchStr = searchStr.toLowerCase().trim();
		return blogs
			.filter((b) => b.title.toLowerCase().includes(normalizedSearchStr))
			.map(({ id, title }) => (
				<FormField
					key={id}
					type='radio'
					data-blog={id}
					text={title}
					wrapperClassNames='w-full justify-end bg-[var(--background-color-card)]'
					name='pin-blog'
					defaultChecked={id === pinnedBlogId}
				/>
			));
	}, [data, pinnedBlogId, searchStr]);
	const allDropdownItems = useMemo(
		() => [drodownSearchField, ...dropdownItems],
		[drodownSearchField, dropdownItems]
	);

	const likedAtObj = useMemo(
		() => likedAt.find((el) => el.postId === postId),
		[likedAt, postId]
	);

	const handleDeletePost = useCallback(() => {
		setType('post');
		setCb(() => {
			deletePost({
				variables: {
					postId,
				},
			});
			setOpen(false);
		});
		setOpen(true);
	}, [deletePost, postId, setCb, setOpen, setType]);
	const handleLike = useCallback(() => {
		if (!isAuth) {
			setNeedAuthOpen(true);
			return;
		}

		const likedAtObj = likedAt.find((el) => el.postId === postId);

		if (
			likedAtObj &&
			likedAtObj.isLiked &&
			!isLikeExpired(likedAtObj.date) &&
			likedAtObj.postId === postId &&
			likedAtObj.userId === profile?.id
		) {
			return;
		}

		updatePost({
			variables: {
				postId,
				data: {
					likesCount: likesCount ? likesCount + 1 : 1,
				},
			},
		});

		setLikedAt((prev) => {
			const filteredPrev = prev.filter((o) => o.postId !== postId);
			return [
				...filteredPrev,
				{
					postId,
					date: Date.now(),
					isLiked: true,
					userId: profile ? profile.id : null,
				},
			];
		});
	}, [
		isAuth,
		likedAt,
		likesCount,
		postId,
		profile,
		setLikedAt,
		setNeedAuthOpen,
		updatePost,
	]);
	const handleTogglePinBlog = useCallback(
		(e: MouseEvent<HTMLUListElement>) => {
			const target = e.target as HTMLElement;
			const radio = target.closest('input');
			if (!radio) return;

			const blogId = radio.dataset.blog;
			if (!blogId) return;

			togglePin({
				variables: {
					blogId,
					postId,
				},
			});
		},
		[postId, togglePin]
	);

	if (isLoading) {
		return;
	}

	return (
		<div className='flex flex-col gap-y-8 bg-[var(--background-color-card)] rounded-xl transition-colors px-2 py-6 md:px-6 w-full'>
			<article className='flex flex-col gap-y-6 w-full'>
				<div className='flex flex-col md:flex-row gap-y-2 md:items-center justify-between'>
					{author && (
						<UserBadgeWithCreatedAt
							author={{
								username: author.username,
								avatarUrl: author.avatarUrl,
							}}
							createdAt={createdAt}
							isShow
						/>
					)}
					{isOwner && (
						<div className='flex items-center gap-x-2'>
							<Dropdown
								isOpen={isDropdownOpen}
								items={allDropdownItems}
								setOpen={setDropdownOpen}
								className='w-full'
								listClassName='w-full top-[calc(100%+0.5rem)] overflow-hidden py-3 px-2.5 shadow-secondary'
								onClick={handleTogglePinBlog}
								displayDirection='top'>
								<Button
									variant='secondary'
									className='bg-[var(--background-color-card)] px-5 py-2 flex gap-x-5 rounded-lg w-full'
									onClick={() => setDropdownOpen((prev) => !prev)}>
									<span className='w-full inline-block text-left'>
										{t('postPage.pinBlog.pin')}
									</span>
									<ChevronDown
										className={cn(
											'transition-transform shrink-0',
											isDropdownOpen && 'rotate-180'
										)}
									/>
								</Button>
							</Dropdown>

							<Button
								variant='secondary'
								className='dark:text-secondary py-1.75 px-3 font-title font-bold leading-[150%] rounded-lg md:w-auto w-full max-w-32.5'
								onClick={handleDeletePost}>
								{t('btns.remove')}
							</Button>

							<CustomLink
								variant='primary'
								href={routesConfig.postUpdate(postId)}
								className='py-2 px-3 font-title font-bold leading-[150%] rounded-lg text-nowrap'>
								{t('postPage.editPost')}
							</CustomLink>
						</div>
					)}
				</div>
				<MilkdownContent
					content={content}
					className='border-b border-primary pb-6'
				/>
				<div className='flex flex-col gap-y-6 md:flex-row justify-between'>
					{tags && <TagsList tags={tags} />}
					<ul className='flex gap-x-6'>
						<li>
							<Button
								variant='clear'
								className={cn(
									'flex items-center gap-x-2',
									likedAtObj?.isLiked && 'hover:text-[--text-color-main]'
								)}
								disabled={
									isUpdating ||
									(likedAtObj?.isLiked &&
										!isLikeExpired(likedAtObj.date) &&
										likedAtObj.userId === profile?.id &&
										likedAtObj.postId === postId)
								}
								onClick={handleLike}>
								<Heart
									className={cn(
										likedAtObj?.isLiked &&
											!isLikeExpired(likedAtObj.date) &&
											likedAtObj.userId === profile?.id &&
											likedAtObj.postId === postId &&
											'stroke-red-500 fill-red-500'
									)}
								/>
								<span className='text-xs font-medium'>{likesCount}</span>
							</Button>
						</li>
						<li className='flex items-center gap-x-2'>
							<MessageSquare />
							<span className='text-xs font-medium'>{getCommentsCount()}</span>
						</li>
						<li className='flex items-center gap-x-2'>
							<Eye />
							<span className='text-xs font-medium'>{viewsCount}</span>
						</li>
					</ul>
				</div>
			</article>
			<CommentsLazy />
		</div>
	);
};
