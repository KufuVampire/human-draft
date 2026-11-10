'use client';

import { editorViewCtx } from '@milkdown/core';
import { Crepe } from '@milkdown/crepe';
import { Milkdown, useEditor } from '@milkdown/react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CreatePostMobileBar } from './components/CreatePostMobileBar';
import { PinBlogDropdown } from './components/PinBlogDropdown';
import { usePinBlogItems } from './hooks/usePinBlogItems';
import { uploadPostImage } from '@/api';
import { routesConfig } from '@/config';
import { useCreatePostMutation } from '@/graphql/generated/output';
import { TypeCreatePostSchema } from '@/schemas';
import { Button, Container, FormField, Section, TagsPicker } from '@/shared';
import { convertImageBlockToImage } from '@/utils';

export const CreatePostPage = () => {
	const router = useRouter();
	const { blogId } = useParams<{ blogId?: string }>();
	const [tags, setTags] = useState<string[]>([]);
	const [isOpen, setOpen] = useState(false);
	const t = useTranslations();
	const {
		register,
		formState: { isValid },
		handleSubmit,
		setFocus,
		watch,
	} = useForm<TypeCreatePostSchema>({
		defaultValues: {
			search: '',
			title: '',
		},
	});

	const { blogIdForPin, allDropdownItems, handlePickBlogForPin } =
		usePinBlogItems({
			register,
			watch,
			isOpen,
			placeholder: t('blogPage.pinPosts.searchFieldPlaceholder'),
		});

	const { loading: isEditorLoading, get } = useEditor(
		(root) =>
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

	useEffect(() => {
		setFocus('title');
	}, [setFocus]);

	const [createPost, { loading: isPostCreating }] = useCreatePostMutation({
		onCompleted(data) {
			router.push(routesConfig.postById(data.createPost.id));
		},
	});

	const onSubmit: SubmitHandler<TypeCreatePostSchema> = async (data, e) => {
		e?.preventDefault();
		if (isEditorLoading) return;

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
				blogId: blogIdForPin ? blogIdForPin : blogId,
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
					{!blogId && (
						<PinBlogDropdown
							isOpen={isOpen}
							items={allDropdownItems}
							setOpen={setOpen}
							buttonText={t('postPage.pinBlog.pin')}
							onPickBlog={handlePickBlogForPin}
						/>
					)}
					<TagsPicker
						tags={tags}
						setTags={setTags}
					/>
					<Button
						type='submit'
						isLoading={isEditorLoading || isPostCreating}
						variant={isValid ? 'primary' : 'disabled'}
						className='rounded-xl py-4 w-full md:font-bold uppercase md:text-xl md:leading-heading leading-heading-tight md:tracking-widest tracking-wider'>
						{t('btns.createPost')}
					</Button>

					<CreatePostMobileBar
						title={watch('title')}
						fallbackTitle={t('createPostPage.title')}
						buttonText={t('btns.createPost')}
						isLoading={isEditorLoading || isPostCreating}
						isValid={isValid}
					/>
				</form>
			</Container>
		</Section>
	);
};
