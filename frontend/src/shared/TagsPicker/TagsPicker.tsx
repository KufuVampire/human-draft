'use client';

import { useTranslations } from 'next-intl';
import {
	Dispatch,
	KeyboardEvent,
	MouseEvent,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../Button/Button';
import { Dropdown } from '../Dropdown/Dropdown';
import { TagsPickerSelectedList } from './TagsPickerSelectedList';

import { useGetTagsBySearchStringQuery } from '@/graphql/generated/output';
import { useDebounce } from '@/hooks';
import { TypeSearchTagsSchema } from '@/schemas';
import { cn } from '@/utils';

interface Props {
	tags: string[];
	setTags: Dispatch<SetStateAction<string[]>>;
	className?: string;
}

export const TagsPicker = ({ tags, setTags, className }: Props) => {
	const t = useTranslations();
	const [isOpen, setOpen] = useState(false);
	const { register, watch, reset, setFocus } = useForm<TypeSearchTagsSchema>({
		defaultValues: {
			search: '',
		},
		mode: 'onChange',
	});
	const search = watch('search');
	const debounceSearch = useDebounce(search);

	const { data } = useGetTagsBySearchStringQuery({
		variables: {
			search: debounceSearch,
		},
		skip: debounceSearch.length < 3,
	});

	const allTags = data?.findTagsBySearchString;
	const mappedTags = useMemo(() => {
		return allTags
			? allTags.map(({ id, name }) => (
					<Button
						variant='clear'
						type='button'
						key={id}
						data-tag={name}
						className='flex items-center py-0.5 px-1 gap-x-0.5 text-foreground font-title text-sm leading-body hover:bg-secondary border border-secondary dark:border-placeholder dark:hover:bg-placeholder transition-colors rounded-sm cursor-pointer'>
						{name}
					</Button>
				))
			: [];
	}, [allTags]);

	useEffect(() => {
		if (debounceSearch.length < 3) {
			setOpen(false);
			return;
		}

		if (allTags && allTags.length > 0) {
			setOpen(true);
		}
	}, [allTags, debounceSearch]);

	useEffect(() => {
		setFocus('search');
	}, [setFocus, tags]);

	const addTag = (tag: string) => {
		if (!tag || tags.includes(tag)) return;
		setTags([...tags, tag]);
		reset({ search: '' });
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleAddTag = (e: MouseEvent<HTMLUListElement>) => {
		const button = (e.target as HTMLElement).closest('button');
		const tag = button?.dataset.tag?.trim();
		if (tag) addTag(tag);
	};

	const handleRemoveTag = (e: MouseEvent<HTMLUListElement>) => {
		const button = (e.target as HTMLElement).closest('button');
		const tag = button?.dataset.tag;
		if (tag) removeTag(tag);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' && !search && tags.length) {
			removeTag(tags[tags.length - 1]);
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag(search.trim());
		}
	};

	const handleOpenDropdownOnFocus = () => {
		setOpen(Boolean(debounceSearch.length >= 3 && allTags && allTags.length > 0));
	};

	return (
		<Dropdown
			isOpen={isOpen}
			items={mappedTags}
			setOpen={setOpen}
			listClassName='border border-border-subtle bg-surface-card shadow-lg w-full px-4 py-3 top-full mt-1 flex-row gap-2 justify-normal'
			itemClassName='w-auto'
			className='w-full'
			onClick={handleAddTag}>
			<div
				className={cn('flex flex-col gap-y-3', className)}
				onClick={() => setFocus('search')}>
				<h2 className='font-bold text-lg font-title text-foreground cursor-pointer'>
					{t('tagsPickerTitle')}
				</h2>
				<div
					role='tags-picker'
					className='flex flex-row flex-wrap items-center border border-border-subtle focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-surface-card cursor-text px-4 py-3 gap-2 rounded-xl transition-all'>
					<TagsPickerSelectedList
						tags={tags}
						register={register}
						placeholder={t('createPostPage.tagPickerPlaceholder')}
						onRemoveTag={handleRemoveTag}
						onOpenDropdownOnFocus={handleOpenDropdownOnFocus}
						onKeyDown={handleKeyDown}
					/>
				</div>
			</div>
		</Dropdown>
	);
};
