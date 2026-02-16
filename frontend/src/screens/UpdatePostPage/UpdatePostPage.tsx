'use client';

import { editorViewCtx } from '@milkdown/core';
import { Crepe } from '@milkdown/crepe';
import { Milkdown, useEditor } from '@milkdown/react';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { uploadPostImage } from '@/api';
import { routesConfig } from '@/config';
import { useUpdatePostMutation } from '@/graphql/generated/output';
import { usePost } from '@/hooks';
import { TypeUpdatePostSchema } from '@/schemas';
import { Button, Container, FormField, Section, TagsPicker } from '@/shared';
import { convertImageBlockToImage, convertImageToImageBlock } from '@/utils';

export const UpdatePostPage = () => {
	const t = useTranslations();
	const [isContentLoaded, setIsContentLoaded] = useState(false);
	const { postId } = useParams<{ postId: string }>();
	const { title, rawContent, tags: postTags } = usePost(postId);
	const {
		handleSubmit,
		register,
		formState: { isValid },
		reset,
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
				redirect(routesConfig.postById(postId));
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
	}, [title]);

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
	}, [rawContent, loading]);

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
					className='w-full'>
					<FormField
						text={t('createPostPage.title')}
						className='w-full outline-0 border-0 [&:not(:placeholder-shown)]:shadow-none px-0'
						placeholder={t('createPostPage.title')}
						{...register('title', { required: true })}
					/>
					<TagsPicker
						tags={tags}
						setTags={setTags}
					/>
					<Milkdown />
					<Button
						type='submit'
						isLoading={loading || isUpdating}
						variant={isValid ? 'primary' : 'disabled'}
						className='rounded-xl py-4 w-full md:font-bold uppercase md:text-xl md:leading-[120%] leading-[110%] md:tracking-[10%] tracking-[5%]'>
						{t('postPage.editPost')}
					</Button>
				</form>
			</Container>
		</Section>
	);
};
