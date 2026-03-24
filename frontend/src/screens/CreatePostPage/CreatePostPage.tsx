'use client';

import { editorViewCtx } from '@milkdown/core';
import { Crepe } from '@milkdown/crepe';
import { Milkdown, useEditor } from '@milkdown/react';
import { ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { uploadPostImage } from '@/api';
import { routesConfig } from '@/config';
import {
	useCreatePostMutation,
	useGetBlogsForPinQuery,
} from '@/graphql/generated/output';
import { useDebounce } from '@/hooks';
import { TypeCreatePostSchema } from '@/schemas';
import {
	Button,
	Container,
	Dropdown,
	FormField,
	Section,
	TagsPicker,
} from '@/shared';
import { cn, convertImageBlockToImage } from '@/utils';

export const CreatePostPage = () => {
	const { blogId } = useParams<{ blogId?: string }>();
	const [tags, setTags] = useState<string[]>([]);
	const [isOpen, setOpen] = useState(false);
	const [blogIdForPin, setBlogIdForPin] = useState<string | null>(null);
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
	const { loading: isEditorLoading, get } = useEditor(
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

	const { data } = useGetBlogsForPinQuery({
		skip: !isOpen,
	});

	const [createPost, { loading: isPostCreating }] = useCreatePostMutation({
		onCompleted(data) {
			redirect(routesConfig.postById(data.createPost.id));
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

	const handlePickBlogForPin = useCallback((e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const radio = target.closest('input');
		if (!radio) return;

		const blogId = radio.dataset.blog;
		if (!blogId) return;

		setBlogIdForPin(blogId);
	}, []);
	
	const searchStr = useDebounce(watch('search'));
	
	const drodownSearchField = useMemo(
		() => (
			<FormField
				{...register('search')}
				placeholder={t('blogPage.pinPosts.searchFieldPlaceholder')}
				className='border-none [&:not(:placeholder-shown)]:shadow-none p-0 rounded-none'
				wrapperClassNames='w-full border border-primary p-2 rounded-sm'
				inputWrapperClassName='flex items-center justify-between flex-row-reverse'>
				<Search />
			</FormField>
		),
		[register, t]
	);
	const dropdownItems = useMemo(() => {
		const blogs = data?.blogsForPin || [];
		const normalizedSearchStr = searchStr.toLowerCase().trim();
		return blogs
			.filter((b) => b.title.toLowerCase().includes(normalizedSearchStr))
			.map(({ id, title }) => (
				<FormField
					key={id}
					type='radio'
					data-blog={id}
					text={title}
					wrapperClassNames='w-full justify-end bg-[var(--background-color-card)]'
					name='pin-blog'
					defaultChecked={id === blogIdForPin}
				/>
			));
	}, [blogIdForPin, data, searchStr]);
	const allDropdownItems = useMemo(
		() => [drodownSearchField, ...dropdownItems],
		[drodownSearchField, dropdownItems]
	);

	return (
		<Section className='flex flex-col w-full bg-[var(--background-color-card)] rounded-xl transition-colors'>
			<Container className='md:px-22 selection:bg-[#ede0d4] dark:selection:bg-primary'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full flex flex-col gap-y-6'>
					<FormField
						text={t('createPostPage.title')}
						className='w-full outline-0 border-0 [&:not(:placeholder-shown)]:shadow-none px-0'
						placeholder={t('createPostPage.title')}
						{...register('title', { required: true })}
					/>
					<Milkdown />
					{!blogId && (
						<Dropdown
							isOpen={isOpen}
							items={allDropdownItems}
							setOpen={setOpen}
							className='w-full'
							listClassName='w-full top-[calc(100%+0.5rem)] overflow-hidden py-3 px-2.5 shadow-secondary min-w-auto'
							itemClassName='first:mb-1'
							onClick={handlePickBlogForPin}
							displayDirection='top'>
							<Button
								variant='secondary'
								className='bg-[var(--background-color-card)] px-5 py-2 flex gap-x-5 rounded-lg w-full'
								onClick={() => setOpen((prev) => !prev)}
								type='button'>
								<span className='w-full inline-block text-left'>
									{t('postPage.pinBlog.pin')}
								</span>
								<ChevronDown
									className={cn(
										'transition-transform shrink-0',
										isOpen && 'rotate-180'
									)}
								/>
							</Button>
						</Dropdown>
					)}
					<TagsPicker
						tags={tags}
						setTags={setTags}
					/>
					<Button
						type='submit'
						isLoading={isEditorLoading || isPostCreating}
						variant={isValid ? 'primary' : 'disabled'}
						className='rounded-xl py-4 w-full md:font-bold uppercase md:text-xl md:leading-[120%] leading-[110%] md:tracking-[10%] tracking-[5%]'>
						{t('btns.createPost')}
					</Button>
				</form>
			</Container>
		</Section>
	);
};
