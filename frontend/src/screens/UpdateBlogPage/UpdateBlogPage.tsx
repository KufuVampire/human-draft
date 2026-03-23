'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
	useGetAllFreePostsForPinQuery,
	useUpdateBlogMutation,
} from '@/graphql/generated/output';
import { useBlog, useDebounce } from '@/hooks';
import { TypeUpdateBlogSchema, createBlogSchema } from '@/schemas';
import { Button, Dropdown, FormField, Section, TagsPicker } from '@/shared';
import { cn } from '@/utils';
import { toast } from 'sonner';
import { routesConfig } from '@/config';

export const UpdateBlogPage = () => {
	const { blogId } = useParams<{ blogId: string }>();
	const { data, loading: isBlogLoading } = useBlog(blogId);
	const [tags, setTags] = useState<string[]>([]);
	const [poster, setPoster] = useState<File | null>(null);
	const [posterUrl, setPosterUrl] = useState<string | null | undefined>(null);
	const [postIds, setPostIds] = useState<string[]>([]);
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const t = useTranslations();
	const {
		register,
		formState: { isValid, isDirty },
		handleSubmit,
		setFocus,
		watch,
		reset,
	} = useForm<TypeUpdateBlogSchema>({
		resolver: zodResolver(createBlogSchema),
		defaultValues: {
			title: '',
			description: '',
			postSearchStr: '',
		},
	});

	const [updateBlog, { loading: isUpdating }] = useUpdateBlogMutation({
		onCompleted(data) {
			if (data.updateBlog) {
				toast.success(t('blogPage.blogUpdatedSuccess'));
				redirect(routesConfig.blogById(blogId));
			}
		},
	});

	const handleLoadPoster = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setPoster(file);
		e.target.value = '';
	};

	const onSubmit: SubmitHandler<TypeUpdateBlogSchema> = (data) => {
		const { title, description } = data;

		updateBlog({
			variables: {
				data: {
					title,
					description,
					postIds,
					tags,
				},
				blogId,
				poster: poster,
			},
		});
	};

	const drodownSearchField = useMemo(
		() => (
			<FormField
				{...register('postSearchStr')}
				placeholder={t('blogPage.pinPosts.searchFieldPlaceholder')}
				className='border-none [&:not(:placeholder-shown)]:shadow-none p-0 rounded-none'
				wrapperClassNames='w-full border border-primary p-2 rounded-sm'
				inputWrapperClassName='flex items-center justify-between flex-row-reverse'>
				<Search />
			</FormField>
		),
		[register, t]
	);

	const postSearchStr = watch('postSearchStr');
	const searchStr = useDebounce(postSearchStr || '');

	const postsData = useGetAllFreePostsForPinQuery({
		variables: {
			searchStr,
		},
		skip: !isDropdownOpen,
	});

	const posts = postsData.data?.getFreePostsForPin;

	const dropdownItems = useMemo(() => {
		return (
			posts?.map(({ id, title }) => (
				<FormField
					key={id}
					type='checkbox'
					data-post={id}
					text={title}
					wrapperClassNames='w-full justify-end bg-[var(--background-color-card)]'
				/>
			)) || []
		);
	}, [posts]);

	const handleClick = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const input = target.closest('input');

		if (!input) return;

		const postId = input.dataset.post;

		if (!postId) return;

		setPostIds((prev) => {
			if (prev.includes(postId)) {
				return prev.filter((id) => id !== postId);
			}

			return [...prev, postId];
		});
	};

	useEffect(() => {
		if (isBlogLoading) return;
		const blog = data?.getBlogById;

		if (!blog) return;

		reset({
			title: blog.title,
			description: blog.description,
		});
		setTags(blog.tags.map(({ name }) => name));
		setPosterUrl(blog.posterUrl)
	}, [data, isBlogLoading, reset]);

	return (
		<div className='flex flex-col gap-y-6 w-full'>
			<Section className='bg-placeholder transition-colors flex flex-col gap-y-6 md:py-0 py-0 rounded-xl w-full relative min-h-60 md:min-h-87.5 overflow-hidden group'>
				{poster && !posterUrl && (
					<Image
						src={URL.createObjectURL(poster)}
						alt={t('blogPage.blogPoster')}
						sizes='100%'
						fill
					/>
				)}
				{!poster && posterUrl && (
					<Image
						src={posterUrl}
						alt={t('blogPage.blogPoster')}
						sizes='100%'
						fill
						className='z-0'
					/>
				)}
				<label
					className={cn(
						'w-full h-full group flex items-center justify-center cursor-pointer',
						poster || posterUrl &&
							'absolute inset-0 bg-[rgba(0,0,0,0.4)] group-hover:opacity-100 md:opacity-0 transition-opacity duration-300'
					)}>
					<div className='bg-primary rounded-full size-30 flex items-center justify-center p-2.5'>
						<Plus className='size-25 stroke-secondary' />
					</div>
					<input
						type='file'
						className='hidden'
						id='poster'
						name='poster'
						onChange={handleLoadPoster}
					/>
				</label>
			</Section>
			<Section className='bg-[var(--background-color-card)] transition-colors flex flex-col gap-y-6 px-2 py-3 md:p-6 rounded-xl w-full'>
				<form
					className='flex flex-col gap-y-6'
					onSubmit={handleSubmit(onSubmit)}>
					<div className='flex flex-col md:flex-row w-full gap-6'>
						<FormField
							text={t('blogPage.fields.title')}
							placeholder={t('blogPage.fields.title')}
							wrapperClassNames='w-full'
							className='border-primary [&:not(:placeholder-shown)]:shadow-none rounded-xl py-3'
							{...register('title', { required: true, min: 3 })}
						/>
						<TagsPicker
							setTags={setTags}
							tags={tags}
							className='gap-y-2'
						/>
					</div>
					<div
						className='flex flex-col gap-y-2'
						onClick={() => setFocus('description')}>
						<h2 className='font-bold text-xl leading-[110%] font-title cursor-pointer'>
							{t('blogPage.fields.description')}
						</h2>
						<textarea
							{...register('description')}
							className='border border-primary resize-y w-full py-3 px-4 rounded-xl outline-0'
							placeholder={t('blogPage.fields.description')}
						/>
					</div>
					<Dropdown
						items={[drodownSearchField, ...dropdownItems]}
						isOpen={isDropdownOpen}
						setOpen={setDropdownOpen}
						listClassName='w-full top-[calc(100%+0.5rem)] overflow-hidden py-3 px-2.5 shadow-secondary'
						onClick={handleClick}>
						<Button
							variant='secondary'
							className='py-2 px-5 rounded-lg justify-between'
							onClick={() => setDropdownOpen((prev) => !prev)}
							type='button'>
							{t('blogPage.pinPosts.pin')}
							<ChevronDown
								className={cn(
									'transition-transform',
									isDropdownOpen && 'rotate-180'
								)}
							/>
						</Button>
					</Dropdown>
					<Button
						disabled={!isValid || isUpdating || isDirty}
						variant={isValid ? 'primary' : 'disabled'}
						type='submit'
						className='py-4 w-full rounded-lg md:font-bold md:text-xl uppercase leading-[110%] md:leading-[120%] tracking-[5%] md:tracking-[10%]'>
						{t('btns.saveChanges')}
					</Button>
				</form>
			</Section>
		</div>
	);
};
