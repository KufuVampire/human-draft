'use client';

import { editorViewCtx } from '@milkdown/core';
import { Crepe } from '@milkdown/crepe';
import { Milkdown, useEditor } from '@milkdown/react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { uploadPostImage } from '@/api';
import { routesConfig } from '@/config';
import { useCreatePostMutation } from '@/graphql/generated/output';
import { TypeCreatePostSchema } from '@/schemas';
import { Button, Container, FormField, Section, TagsPicker } from '@/shared';
import { convertImageBlockToImage } from '@/utils';

export const CreatePostPage = () => {
	const [tags, setTags] = useState<string[]>([]);
	const [isContentValid, setContentValid] = useState(false);
	const t = useTranslations();
	const {
		register,
		formState: { isValid },
		handleSubmit,
		setFocus,
	} = useForm<TypeCreatePostSchema>();
	const { loading, get } = useEditor(
		(root) => {
			const crepe = new Crepe({
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
			});
			return crepe;
		},
		[t]
	);

	useEffect(() => {
		setFocus('title');
	}, [setFocus]);

	useEffect(() => {
		if (loading) return;

		const editor = get();
		if (!editor) return;

		editor.action((ctx) => {
			if (!editorViewCtx) return;
			const view = ctx.get(editorViewCtx);

			const originalDispatch = view.dispatch.bind(view);

			view.dispatch = (tr) => {
				originalDispatch(tr);

				const doc = view.state.doc;
				const isValid = doc.textContent.trim().length > 0;

				setContentValid(isValid);
			};

			setContentValid(view.state.doc.textContent.trim().length > 0);
		});
	}, [get, loading]);

	const [createPost, { loading: isPostCreating }] = useCreatePostMutation({
		onCompleted(data) {
			redirect(routesConfig.postById(data.createPost.id));
		},
	});

	const onSubmit: SubmitHandler<TypeCreatePostSchema> = async (data, e) => {
		e?.preventDefault();
		if (loading) return;

		const editor = get();

		if (!editor) return;

		const json = editor.action((ctx) =>
			ctx.get(editorViewCtx).state.doc.toJSON()
		);

		const convertedJson = convertImageBlockToImage(json);

		createPost({
			variables: {
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
						isLoading={loading || isPostCreating}
						variant={isValid && isContentValid ? 'primary' : 'disabled'}
						className='rounded-xl py-4 w-full md:font-bold uppercase md:text-xl md:leading-[120%] leading-[110%] md:tracking-[10%] tracking-[5%]'>
						{t('btns.createPost')}
					</Button>
				</form>
			</Container>
		</Section>
	);
};
