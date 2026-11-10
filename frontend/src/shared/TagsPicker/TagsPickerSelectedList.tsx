'use client';

import { X } from 'lucide-react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { UseFormRegister } from 'react-hook-form';

import { Button } from '../Button/Button';
import { FormField } from '../FormField/FormField';
import type { TypeSearchTagsSchema } from '@/schemas';

interface Props {
	tags: string[];
	register: UseFormRegister<TypeSearchTagsSchema>;
	placeholder: string;
	onRemoveTag: (e: MouseEvent<HTMLUListElement>) => void;
	onOpenDropdownOnFocus: () => void;
	onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const TagsPickerSelectedList = ({
	tags,
	register,
	placeholder,
	onRemoveTag,
	onOpenDropdownOnFocus,
	onKeyDown,
}: Props) => {
	return (
		<ul
			className='flex flex-wrap items-center gap-2.5'
			onClick={onRemoveTag}>
			{tags.map((tag) => (
				<li key={tag}>
					<Button
						variant='clear'
						type='button'
						data-tag={tag}
						className='flex items-center py-0.5 px-1 gap-x-0.5 text-foreground font-title text-xs leading-body bg-secondary dark:bg-placeholder dark:hover:bg-primary-hover hover:bg-primary hover:text-secondary transition-colors rounded-sm cursor-pointer'>
						<span>{tag}</span>
						<X className='size-4' />
					</Button>
				</li>
			))}
			<li key='tag-search-input'>
				<FormField
					{...register('search', {
						min: 2,
					})}
					onFocus={onOpenDropdownOnFocus}
					onKeyDown={onKeyDown}
					wrapperClassNames='max-w-30'
					inputWrapperClassName='w-auto'
					className='border-none [&:not(:placeholder-shown)]:shadow-none px-0 py-0'
					placeholder={placeholder}
				/>
			</li>
		</ul>
	);
};
