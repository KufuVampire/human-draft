import { X } from 'lucide-react';
import {
	forwardRef,
	KeyboardEvent,
	useRef,
	useState,
} from 'react';

import { cn } from '@/utils';

export interface TagInputProps {
	tags: string[];
	onChange: (tags: string[]) => void;
	maxTags?: number;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
	(
		{
			tags,
			onChange,
			maxTags = 10,
			placeholder = 'Добавьте тег и нажмите Enter...',
			disabled = false,
			className,
		},
		ref
	) => {
		const [inputValue, setInputValue] = useState('');
		const inputRef = useRef<HTMLInputElement | null>(null);

		const addTag = (rawTag: string) => {
			const trimmed = rawTag.trim().toLowerCase();
			if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return;
			onChange([...tags, trimmed]);
			setInputValue('');
		};

		const removeTag = (indexToRemove: number) => {
			if (disabled) return;
			onChange(tags.filter((_, idx) => idx !== indexToRemove));
		};

		const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' || e.key === ',') {
				e.preventDefault();
				addTag(inputValue);
			} else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
				removeTag(tags.length - 1);
			}
		};

		return (
			<div
				onClick={() => inputRef.current?.focus()}
				className={cn(
					'flex flex-wrap items-center gap-1.5 min-h-10 p-1.5 w-full bg-surface-card border border-border-field rounded-xl cursor-text transition-colors focus-within:border-primary focus-within:shadow-focus',
					disabled &&
						'opacity-50 cursor-not-allowed border-border-subtle bg-surface-tag',
					className
				)}>
				{tags.map((tag, idx) => (
					<span
						key={`${tag}-${idx}`}
						className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-surface-tag text-xs font-medium text-foreground select-none'>
						#{tag}
						{!disabled && (
							<button
								type='button'
								onClick={(e) => {
									e.stopPropagation();
									removeTag(idx);
								}}
								aria-label={`Удалить тег ${tag}`}
								className='hover:text-error transition-colors cursor-pointer p-0.5'>
								<X className='size-3' />
							</button>
						)}
					</span>
				))}
				{tags.length < maxTags && (
					<input
						ref={(el) => {
							inputRef.current = el;
							if (typeof ref === 'function') {
								ref(el);
							} else if (ref) {
								ref.current = el;
							}
						}}
						type='text'
						value={inputValue}
						disabled={disabled}
						placeholder={tags.length === 0 ? placeholder : ''}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						className='flex-1 min-w-24 bg-transparent px-1.5 py-1 text-sm text-foreground placeholder:text-placeholder outline-none disabled:cursor-not-allowed'
					/>
				)}
			</div>
		);
	}
);

TagInput.displayName = 'TagInput';
