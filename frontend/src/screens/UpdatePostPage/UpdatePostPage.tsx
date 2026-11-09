'use client';

import { editorViewCtx } from '@milkdown/core';
import { Crepe } from '@milkdown/crepe';
import { Milkdown, useEditor } from '@milkdown/react';
import { useTranslations } from 'next-intl';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { uploadPostImage } from '@/api';
import { routesConfig } from '@/config';
import { useUpdatePostMutation } from '@/graphql/generated/output';
import { usePost } from '@/hooks';
import { TypeUpdatePostSchema } from '@/schemas';
import { Button, Container, FormField, Section, TagsPicker } from '@/shared';
import {
	convertImageBlockToImage,
	convertImageToImageBlock,
	isNotFoundError,
} from '@/utils';

export const UpdatePostPage = () => {
	const t = useTranslations();
	const router = useRouter();
	const [isContentLoaded, setIsContentLoaded] = useState(false);
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
	const { loading, get } = useEditor(
		(root: HTMLElement) =>
			new Crepe({
				root,
				features: {
					placeholder: true,
					'image-block': true,
				},
				featureConfigs: {
					placeholder: {
						text: t('createPostPage.defaultValue'),
					},
					'code-mirror': {
						copyText: t('createPostPage.copyCode'),
					},
					'image-block': {
						onUpload: async (file) => {
							const data = await uploadPostImage(file);
							return data.url;
						},
					},
				},
			}),
		[t]
	);

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

	useEffect(() => {
		if (!rawContent || loading || isContentLoaded) return;

		const editor = get();
		if (!editor) return;
		const convertedJson = convertImageToImageBlock(rawContent);
		editor.action((ctx) => {
			const view = ctx.get(editorViewCtx);
			const node = view.state.schema.nodeFromJSON(convertedJson);
			const tr = view.state.tr.replaceWith(
				0,
				view.state.doc.content.size,
				node
			);
			view.dispatch(tr);
		});

		setIsContentLoaded(true);
	}, [rawContent, loading, isContentLoaded, get]);

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
		<Section className='flex flex-col w-full bg-[var(--background-color-card)] rounded-xl transition-colors'>
			<Container className='md:px-22 selection:bg-[#ede0d4] dark:selection:bg-primary'>
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
						className='rounded-xl py-4 w-full md:font-bold uppercase md:text-xl md:leading-[120%] leading-[110%] md:tracking-[10%] tracking-[5%]'>
						{t('postPage.editPost')}
					</Button>

					<div className='fixed bottom-0 left-0 right-0 z-30 p-3 bg-[var(--background-color-card)]/90 backdrop-blur-md border-t border-[var(--border-color-primary)] md:hidden flex items-center justify-between gap-x-3'>
						<span className='text-sm text-secondary truncate font-medium'>
							{watch('title') || t('createPostPage.title')}
						</span>
						<Button
							type='submit'
							isLoading={loading || isUpdating}
							variant={isValid ? 'primary' : 'disabled'}
							className='rounded-lg py-2.5 px-5 font-bold uppercase text-sm shrink-0'>
							{t('postPage.editPost')}
						</Button>
					</div>
				</form>
			</Container>
		</Section>
	);
};
