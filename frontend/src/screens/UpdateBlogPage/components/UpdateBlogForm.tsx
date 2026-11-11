'use client';

import { useTranslations } from 'next-intl';
import type { Dispatch, SetStateAction } from 'react';
import type {
	UseFormHandleSubmit,
	UseFormRegister,
	UseFormSetFocus,
} from 'react-hook-form';

import { BlogPinnedPostsDropdown } from '../../CreateBlogPage/components/BlogPinnedPostsDropdown';
import type { TypeUpdateBlogSchema } from '@/schemas';
import { Button, FormField, Section, TagsPicker } from '@/shared';

interface PostItem {
	id: string;
	title: string;
}

interface Props {
	register: UseFormRegister<TypeUpdateBlogSchema>;
	handleSubmit: UseFormHandleSubmit<TypeUpdateBlogSchema>;
	setFocus: UseFormSetFocus<TypeUpdateBlogSchema>;
	onSubmit: (data: TypeUpdateBlogSchema) => void;
	tags: string[];
	setTags: Dispatch<SetStateAction<string[]>>;
	posts: PostItem[];
	isDropdownOpen: boolean;
	setDropdownOpen: Dispatch<SetStateAction<boolean>>;
	onDropdownClick: (e: React.MouseEvent<HTMLUListElement>) => void;
	isValid: boolean;
	isDirty: boolean;
	isUpdating: boolean;
}

export const UpdateBlogForm = ({
	register,
	handleSubmit,
	setFocus,
	onSubmit,
	tags,
	setTags,
	posts,
	isDropdownOpen,
	setDropdownOpen,
	onDropdownClick,
	isValid,
	isDirty,
	isUpdating,
}: Props) => {
	const t = useTranslations();

	return (
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
					onClick={onDropdownClick}
				/>
				<Button
					disabled={!isValid || isUpdating || !isDirty}
					variant='primary'
					type='submit'
					isLoading={isUpdating}
					className='py-3.5 w-full rounded-xl font-bold text-sm uppercase tracking-wider shadow-xs hover:shadow-primary transition-all'>
					{t('btns.saveChanges')}
				</Button>
			</form>
		</Section>
	);
};
