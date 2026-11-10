'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { notFound, useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { UpdateBlogForm } from './components/UpdateBlogForm';
import { UpdateBlogPosterUpload } from './components/UpdateBlogPosterUpload';
import { useFreePostsForPin } from './hooks/useFreePostsForPin';
import { routesConfig } from '@/config';
import {
	GetAllFreePostsForPinDocument,
	useUpdateBlogMutation,
} from '@/graphql/generated/output';
import { useBlog, useBlobUrl } from '@/hooks';
import { TypeUpdateBlogSchema, createBlogSchema } from '@/schemas';
import { isNotFoundError } from '@/utils';

export const UpdateBlogPage = () => {
	const router = useRouter();
	const { blogId } = useParams<{ blogId: string }>();
	const { data, loading: isBlogLoading, error } = useBlog(blogId);

	useEffect(() => {
		if (isBlogLoading) return;

		if (error) {
			if (isNotFoundError(error)) {
				notFound();
			}
			return;
		}

		if (!data?.getBlogById) {
			notFound();
		}
	}, [isBlogLoading, data, error]);

	if (error && !isNotFoundError(error)) {
		throw error;
	}
	const [tags, setTags] = useState<string[]>([]);
	const [poster, setPoster] = useState<File | null>(null);
	const posterBlobUrl = useBlobUrl(poster);
	const [posterUrl, setPosterUrl] = useState<string | null | undefined>(null);
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

	const { postIds, dropdownItems, searchField, handleClick } =
		useFreePostsForPin({
			register,
			watch,
			isDropdownOpen,
			placeholder: t('blogPage.pinPosts.searchFieldPlaceholder'),
		});

	const [updateBlog, { loading: isUpdating }] = useUpdateBlogMutation({
		refetchQueries: [{ query: GetAllFreePostsForPinDocument }],
		onCompleted(res) {
			if (res.updateBlog) {
				toast.success(t('blogPage.blogUpdatedSuccess'));
				router.push(routesConfig.blogById(blogId));
			}
		},
	});

	const handleLoadPoster = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setPoster(file);
		e.target.value = '';
	};

	const onSubmit: SubmitHandler<TypeUpdateBlogSchema> = (formData) => {
		const { title, description } = formData;

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

	useEffect(() => {
		if (isBlogLoading) return;
		const blog = data?.getBlogById;

		if (!blog) return;

		reset({
			title: blog.title,
			description: blog.description,
		});
		setTags(blog.tags.map(({ name }) => name));
		setPosterUrl(blog.posterUrl);
	}, [data, isBlogLoading, reset]);

	return (
		<div className='flex flex-col gap-y-6 w-full'>
			<UpdateBlogPosterUpload
				posterBlobUrl={posterBlobUrl}
				posterUrl={posterUrl}
				hasPoster={!!poster}
				altText={t('blogPage.blogPoster')}
				onLoadPoster={handleLoadPoster}
			/>
			<UpdateBlogForm
				register={register}
				handleSubmit={handleSubmit}
				setFocus={setFocus}
				onSubmit={onSubmit}
				tags={tags}
				setTags={setTags}
				searchField={searchField}
				dropdownItems={dropdownItems}
				isDropdownOpen={isDropdownOpen}
				setDropdownOpen={setDropdownOpen}
				onDropdownClick={handleClick}
				isValid={isValid}
				isDirty={isDirty}
				isUpdating={isUpdating}
			/>
		</div>
	);
};
