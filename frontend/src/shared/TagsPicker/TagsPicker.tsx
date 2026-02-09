'use client';

import { X } from 'lucide-react';
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
import { FormField } from '../FormField/FormField';

import { useGetTagsBySearchStringQuery } from '@/graphql/generated/output';
import { useDebounce } from '@/hooks';
import { TypeSearchTagsSchema } from '@/schemas';
import { useTranslations } from 'next-intl';

interface Props {
	tags: string[];
	setTags: Dispatch<SetStateAction<string[]>>;
}

export const TagsPicker = ({ tags, setTags }: Props) => {
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
						className='flex items-center py-0.5 px-1 gap-x-0.5 text-[var(--text-color-main)] font-title text-sm leading-[150%] hover:bg-secondary border border-secondary dark:border-placeholder dark:hover:bg-placeholder transition-colors rounded-sm cursor-pointer'>
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
		if (tags.length > 1) {
			setFocus('search');
		} else {
			setFocus('search');
		}
	}, [setFocus, tags]);

	const addTag = (tag: string) => {
		if (!tag || tags.includes(tag)) return;
		setTags([...tags, tag]);
		reset({
			search: '',
		});
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleAddTag = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const button = target.closest('button');

		if (!button) return;

		const tag = button.dataset.tag;

		if (!tag) return;

		addTag(tag);
	};

	const handleRemoveTag = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const button = target.closest('button');

		if (!button) return;

		const tag = button.dataset.tag;

		if (!tag) return;

		removeTag(tag);
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
		if (debounceSearch.length >= 3 && allTags && allTags.length > 0) {
			setOpen(true);
			return;
		}

		setOpen(false);
	};

	return (
		<Dropdown
			isOpen={isOpen}
			items={mappedTags}
			setOpen={setOpen}
			listClassName='border border-primary w-full px-4 py-3 top-[calc(100%+0.25rem)] flex-row gap-2.5 justify-normal'
			itemClassName='w-auto'
			onClick={handleAddTag}>
			<div
				className='flex flex-row flex-wrap items-center border border-primary rounded cursor-text px-4 py-3 gap-2.5 rounded-xl'
				onClick={() => setFocus('search')}>
				<ul
					className='flex flex-wrap gap-2.5'
					onClick={handleRemoveTag}>
					{[
						...tags.map((tag) => (
							<li key={tag}>
								<Button
									variant='clear'
									type='button'
									data-tag={tag}
									className='flex items-center py-0.5 px-1 gap-x-0.5 text-[var(--text-color-main)] font-title text-sm leading-[150%] bg-secondary dark:bg-placeholder dark:hover:bg-primary-hover hover:bg-primary hover:text-secondary transition-colors rounded-sm cursor-pointer'>
									<span>{tag}</span>
									<X className='size-4' />
								</Button>
							</li>
						)),
						<li key='tag-search-input'>
							<FormField
								{...register('search', {
									min: 2,
								})}
								onFocus={handleOpenDropdownOnFocus}
								onKeyDown={handleKeyDown}
								wrapperClassNames='max-w-30'
								inputWrapperClassName='w-auto'
								className='border-none [&:not(:placeholder-shown)]:shadow-none px-0 py-0'
								placeholder={t('createPostPage.tagPickerPlaceholder')}
							/>
						</li>,
					]}
				</ul>
			</div>
		</Dropdown>
	);
};
