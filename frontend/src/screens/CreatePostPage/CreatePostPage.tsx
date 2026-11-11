'use client';

import { editorViewCtx } from '@milkdown/core';
import { Milkdown } from '@milkdown/react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { PinBlogDropdown } from './components/PinBlogDropdown';
import { useCreatePostEditor } from './hooks/useCreatePostEditor';
import { usePinBlogItems } from './hooks/usePinBlogItems';
import { routesConfig } from '@/config';
import { useCreatePostMutation } from '@/graphql/generated/output';
import { TypeCreatePostSchema } from '@/schemas';
import {
	Button,
	Container,
	EditorToolbar,
	FormField,
	Section,
	TagsPicker,
} from '@/shared';
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

	const { loading: isEditorLoading, get } = useCreatePostEditor({ t });

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
		<Section className='flex flex-col w-full bg-surface-card rounded-2xl border border-border-subtle shadow-sm transition-colors p-4 md:p-8'>
			<Container className='selection:bg-selection'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full flex flex-col gap-y-6'>
					<div className='flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-border-subtle pb-4'>
						<FormField
							text={t('createPostPage.title')}
							className='w-full outline-0 border-0 [&:not(:placeholder-shown)]:shadow-none px-0 text-2xl md:text-3xl font-bold font-title'
							placeholder={t('createPostPage.title')}
							{...register('title', { required: true })}
						/>
						<div className='flex items-center gap-3 shrink-0'>
							{!blogId && (
								<PinBlogDropdown
									isOpen={isOpen}
									items={allDropdownItems}
									setOpen={setOpen}
									buttonText={t('postPage.pinBlog.pin')}
									onPickBlog={handlePickBlogForPin}
								/>
							)}
							<Button
								type='submit'
								isLoading={isEditorLoading || isPostCreating}
								disabled={!isValid || isEditorLoading || isPostCreating}
								variant='primary'
								className='rounded-xl px-6 py-2.5 font-bold uppercase text-sm tracking-wider shrink-0'>
								{t('btns.createPost')}
							</Button>
						</div>
					</div>

					<EditorToolbar getEditor={get} />
					<Milkdown />
					<TagsPicker
						tags={tags}
						setTags={setTags}
					/>
				</form>
			</Container>
		</Section>
	);
};
