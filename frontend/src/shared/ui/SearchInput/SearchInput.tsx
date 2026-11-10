import { Search, X } from 'lucide-react';
import {
	ChangeEvent,
	forwardRef,
	InputHTMLAttributes,
	KeyboardEvent,
	useRef,
	useState,
} from 'react';

import { cn } from '@/utils';

export interface SearchInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	(
		{
			className,
			value,
			defaultValue,
			onChange,
			onClear,
			disabled = false,
			placeholder = 'Поиск...',
			...props
		},
		forwardedRef
	) => {
		const inputRef = useRef<HTMLInputElement | null>(null);
		const [internalValue, setInternalValue] = useState(
			defaultValue !== undefined ? String(defaultValue) : ''
		);
		const isControlled = value !== undefined;
		const currentValue = isControlled ? String(value) : internalValue;
		const hasValue = Boolean(currentValue && currentValue.length > 0);

		const handleClear = () => {
			if (inputRef.current) {
				inputRef.current.value = '';
			}
			if (!isControlled) {
				setInternalValue('');
			}
			onClear?.();
		};

		const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Escape') {
				handleClear();
			}
			props.onKeyDown?.(e);
		};

		return (
			<div
				className={cn(
					'relative flex items-center w-full bg-surface-card border border-border-field rounded-xl px-3 h-10 transition-colors focus-within:border-primary focus-within:shadow-focus',
					disabled &&
						'opacity-50 cursor-not-allowed border-border-subtle bg-surface-tag',
					className
				)}>
				<Search className='size-4 text-placeholder shrink-0' />
				<input
					ref={(el) => {
						inputRef.current = el;
						if (typeof forwardedRef === 'function') {
							forwardedRef(el);
						} else if (forwardedRef) {
							forwardedRef.current = el;
						}
					}}
					type='search'
					value={value}
					defaultValue={defaultValue}
					placeholder={placeholder}
					disabled={disabled}
					onChange={(e) => {
						if (!isControlled) {
							setInternalValue(e.target.value);
						}
						onChange?.(e);
					}}
					onKeyDown={handleKeyDown}
					className='w-full bg-transparent px-2 text-sm text-foreground placeholder:text-placeholder outline-none [&::-webkit-search-cancel-button]:hidden'
					{...props}
				/>
				{hasValue && !disabled && (
					<button
						type='button'
						onClick={handleClear}
						aria-label='Очистить поиск'
						className='shrink-0 text-placeholder hover:text-foreground p-0.5 rounded cursor-pointer transition-colors'>
						<X className='size-4' />
					</button>
				)}
			</div>
		);
	}
);

SearchInput.displayName = 'SearchInput';
