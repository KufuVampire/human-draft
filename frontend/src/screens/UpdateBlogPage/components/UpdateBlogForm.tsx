'use client';

import { useTranslations } from 'next-intl';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type {
	FieldErrors,
	UseFormHandleSubmit,
	UseFormRegister,
	UseFormSetFocus,
} from 'react-hook-form';

import { Button, Dropdown, FormField, Section, TagsPicker } from '@/shared';
import type { TypeUpdateBlogSchema } from '@/schemas';

interface Props {
	register: UseFormRegister<TypeUpdateBlogSchema>;
	handleSubmit: UseFormHandleSubmit<TypeUpdateBlogSchema>;
	setFocus: UseFormSetFocus<TypeUpdateBlogSchema>;
	onSubmit: (data: TypeUpdateBlogSchema) => void;
	tags: string[];
	setTags: Dispatch<SetStateAction<string[]>>;
	searchField: ReactNode;
	dropdownItems: ReactNode[];
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
	searchField,
	dropdownItems,
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
				<Dropdown
					items={[searchField, ...dropdownItems]}
					isOpen={isDropdownOpen}
					setOpen={setDropdownOpen}
					listClassName='w-full top-[calc(100%+0.5rem)] overflow-hidden py-3 px-2.5 shadow-secondary'
					onClick={onDropdownClick}>
					<Button
						variant='secondary'
						className='py-2 px-5 rounded-lg justify-between'
						onClick={() => setDropdownOpen((prev) => !prev)}
						type='button'>
						{t('blogPage.pinPosts.pin')}
					</Button>
				</Dropdown>
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
