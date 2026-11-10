'use client';

import { editorViewCtx } from '@milkdown/core';
import { Milkdown } from '@milkdown/react';
import { useTranslations } from 'next-intl';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { UpdatePostMobileBar } from './components/UpdatePostMobileBar';
import { useUpdatePostEditor } from './hooks/useUpdatePostEditor';
import { routesConfig } from '@/config';
import { useUpdatePostMutation } from '@/graphql/generated/output';
import { usePost } from '@/hooks';
import { TypeUpdatePostSchema } from '@/schemas';
import { Button, Container, FormField, Section, TagsPicker } from '@/shared';
import { convertImageBlockToImage, isNotFoundError } from '@/utils';

export const UpdatePostPage = () => {
	const t = useTranslations();
	const router = useRouter();
	const { postId } = useParams<{ postId: string }>();
	const { title, rawContent, tags: postTags, isLoading, post, error } =
		usePost(postId);

	useEffect(() => {
		if (isLoading) return;

		if (error) {
			if (isNotFoundError(error)) {
				notFound();
			}
			return;
		}

		if (!post) {
			notFound();
		}
	}, [isLoading, post, error]);

	if (error && !isNotFoundError(error)) {
		throw error;
	}
	const {
		handleSubmit,
		register,
		formState: { isValid },
		reset,
		watch,
	} = useForm<TypeUpdatePostSchema>();
	const [tags, setTags] = useState<string[]>([]);
	const { loading, get } = useUpdatePostEditor({ t, rawContent });

	const [updatePost, { loading: isUpdating }] = useUpdatePostMutation({
		onCompleted(data) {
			if (data.updatePost) {
				toast.success(t('postPage.postUpdatedSuccess'));
				router.push(routesConfig.postById(postId));
			}
		},
	});

	useEffect(() => {
		if (postTags) {
			const mappedTags = postTags?.map((tag) => tag.name) || [];
			setTags(mappedTags);
		}

		if (title) {
			reset({ title });
		}
	}, [title, postTags, reset]);

	const onSubmit: SubmitHandler<TypeUpdatePostSchema> = async (data, e) => {
		e?.preventDefault();
		if (loading) return;

		const editor = get();
		if (!editor) return;

		const json = editor.action((ctx) =>
			ctx.get(editorViewCtx).state.doc.toJSON()
		);
		const convertedJson = convertImageBlockToImage(json);

		updatePost({
			variables: {
				postId,
				data: {
					title: data.title,
					content: convertedJson,
					tags,
				},
			},
		});
	};

	return (
		<Section className='flex flex-col w-full bg-surface-card rounded-xl transition-colors'>
			<Container className='md:px-22 selection:bg-selection'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full flex flex-col gap-y-6 pb-20 md:pb-0'>
					<FormField
						text={t('createPostPage.title')}
						className='w-full outline-0 border-0 [&:not(:placeholder-shown)]:shadow-none px-0'
						placeholder={t('createPostPage.title')}
						{...register('title', { required: true })}
					/>
					<Milkdown />
					<TagsPicker
						tags={tags}
						setTags={setTags}
					/>
					<Button
						type='submit'
						isLoading={loading || isUpdating}
						variant={isValid ? 'primary' : 'disabled'}
						className='rounded-xl py-4 w-full md:font-bold uppercase md:text-xl md:leading-heading leading-heading-tight md:tracking-widest tracking-wider'>
						{t('postPage.editPost')}
					</Button>

					<UpdatePostMobileBar
						title={watch('title')}
						fallbackTitle={t('createPostPage.title')}
						buttonText={t('postPage.editPost')}
						isLoading={loading || isUpdating}
						isValid={isValid}
					/>
				</form>
			</Container>
		</Section>
	);
};
