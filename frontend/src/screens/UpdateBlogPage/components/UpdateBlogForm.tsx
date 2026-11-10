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
		<Section className='bg-surface-card transition-colors flex flex-col gap-y-6 px-2 py-3 md:p-6 rounded-xl w-full'>
			<form
				className='flex flex-col gap-y-6'
				onSubmit={handleSubmit(onSubmit)}>
				<div className='flex flex-col md:flex-row w-full gap-6'>
					<FormField
						text={t('blogPage.fields.title')}
						placeholder={t('blogPage.fields.title')}
						wrapperClassNames='w-full'
						className='border-primary [&:not(:placeholder-shown)]:shadow-none rounded-xl py-3'
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
					<h2 className='font-bold text-xl leading-heading-tight font-title cursor-pointer'>
						{t('blogPage.fields.description')}
					</h2>
					<textarea
						{...register('description')}
						className='border border-primary resize-y w-full py-3 px-4 rounded-xl outline-0'
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
					variant={isValid ? 'primary' : 'disabled'}
					type='submit'
					className='py-4 w-full rounded-lg md:font-bold md:text-xl uppercase leading-heading-tight md:leading-heading tracking-wider md:tracking-widest'>
					{t('btns.saveChanges')}
				</Button>
			</form>
		</Section>
	);
};
