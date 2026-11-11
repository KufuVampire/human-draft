'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BlogPinnedPostsDropdown } from './components/BlogPinnedPostsDropdown';
import { BlogPosterUpload } from './components/BlogPosterUpload';
import { routesConfig } from '@/config';
import { useCreateBlogMutation } from '@/graphql/generated/output';
import { useBlobUrl, useFreePostsForPin } from '@/hooks';
import { TypeCreateBlogSchema, createBlogSchema } from '@/schemas';
import { Button, FormField, Section, TagsPicker } from '@/shared';

export const CreateBlogPage = () => {
	const router = useRouter();
	const [tags, setTags] = useState<string[]>([]);
	const [poster, setPoster] = useState<File | null>(null);
	const posterBlobUrl = useBlobUrl(poster);
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const t = useTranslations();
	const {
		register,
		formState: { isValid },
		handleSubmit,
		setFocus,
		watch,
	} = useForm<TypeCreateBlogSchema>({
		resolver: zodResolver(createBlogSchema),
		defaultValues: {
			title: '',
			description: '',
			postSearchStr: '',
		},
	});

	const { postIds, posts, handleClick } = useFreePostsForPin({
		watch,
		isDropdownOpen,
	});

	const [createBlog, { loading: isCreating }] = useCreateBlogMutation({
		onCompleted(data) {
			router.push(routesConfig.blogById(data.createBlog.id));
		},
		onError(err) {
			console.error(err);
		},
	});

	const handleLoadPoster = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setPoster(file);
		e.target.value = '';
	};

	const onSubmit: SubmitHandler<TypeCreateBlogSchema> = (data) => {
		const { title, description } = data;

		createBlog({
			variables: {
				data: {
					title,
					description,
					postIds,
					tags,
				},
				poster: poster,
			},
		});
	};

	return (
		<div className='flex flex-col gap-y-6 w-full'>
			<BlogPosterUpload
				posterBlobUrl={posterBlobUrl}
				hasPoster={!!poster}
				altText={t('blogPage.blogPoster')}
				onLoadPoster={handleLoadPoster}
			/>
			<Section className='bg-surface-card rounded-2xl border border-border-subtle shadow-sm p-4 sm:p-6 md:p-8 w-full'>
				<form
					className='flex flex-col gap-y-6'
					onSubmit={handleSubmit(onSubmit)}>
					<div className='flex flex-col md:flex-row w-full gap-6'>
						<FormField
							text={t('blogPage.fields.title')}
							placeholder={t('blogPage.fields.title')}
							wrapperClassNames='w-full'
							className='border border-border-subtle focus:border-primary rounded-xl py-3 px-4'
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
						<h2 className='font-bold text-lg font-title text-foreground cursor-pointer'>
							{t('blogPage.fields.description')}
						</h2>
						<textarea
							{...register('description')}
							className='border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-card text-foreground resize-y w-full min-h-28 py-3 px-4 rounded-xl outline-none transition-all'
							placeholder={t('blogPage.fields.description')}
						/>
					</div>
					<BlogPinnedPostsDropdown
						posts={posts}
						isOpen={isDropdownOpen}
						setOpen={setDropdownOpen}
						register={register}
						onClick={handleClick}
					/>
					<Button
						disabled={!isValid || isCreating}
						variant='primary'
						type='submit'
						isLoading={isCreating}
						className='py-3.5 w-full rounded-xl font-bold text-sm uppercase tracking-wider shadow-xs hover:shadow-primary transition-all'>
						{t('btns.createBlog')}
					</Button>
				</form>
			</Section>
		</div>
	);
};
