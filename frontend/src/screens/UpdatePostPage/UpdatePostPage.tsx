'use client';

import { editorViewCtx } from '@milkdown/core';
import { Milkdown } from '@milkdown/react';
import { useTranslations } from 'next-intl';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useUpdatePostEditor } from './hooks/useUpdatePostEditor';
import { routesConfig } from '@/config';
import { useUpdatePostMutation } from '@/graphql/generated/output';
import { usePost } from '@/hooks';
import { TypeUpdatePostSchema } from '@/schemas';
import {
	Button,
	Container,
	EditorToolbar,
	FormField,
	Section,
	TagsPicker,
} from '@/shared';
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
						<div className='flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0'>
							<Button
								type='submit'
								isLoading={loading || isUpdating}
								disabled={!isValid || loading || isUpdating}
								variant='primary'
								className='rounded-xl px-6 py-2.5 font-bold uppercase text-sm tracking-wider w-full sm:w-auto shrink-0'>
								{t('postPage.editPost')}
							</Button>
						</div>
					</div>

					<Milkdown />
					<TagsPicker
						tags={tags}
						setTags={setTags}
					/>
					{/* Последним в форме: sticky держит тулбар у края экрана и не пускает на футер */}
					<EditorToolbar getEditor={get} />
				</form>
			</Container>
		</Section>
	);
};
