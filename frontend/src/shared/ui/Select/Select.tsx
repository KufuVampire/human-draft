import { ChevronDown } from 'lucide-react';
import {
	forwardRef,
	KeyboardEvent,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';

import { SelectList } from './SelectList';
import { cn } from '@/utils';

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectProps {
	options: SelectOption[];
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean | string;
	className?: string;
	onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
	(
		{
			options,
			value,
			placeholder = 'Выберите...',
			disabled = false,
			error = false,
			className,
			onChange,
		},
		ref
	) => {
		const [isOpen, setIsOpen] = useState(false);
		const [highlightedIndex, setHighlightedIndex] = useState(-1);
		const containerRef = useRef<HTMLDivElement>(null);
		const listboxId = useId();

		const selectedOption = options.find((o) => o.value === value);

		useEffect(() => {
			const handleClickOutside = (e: MouseEvent) => {
				if (
					containerRef.current &&
					!containerRef.current.contains(e.target as Node)
				) {
					setIsOpen(false);
				}
			};
			document.addEventListener('mousedown', handleClickOutside);
			return () =>
				document.removeEventListener('mousedown', handleClickOutside);
		}, []);

		const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
			if (disabled) return;
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					setHighlightedIndex(0);
					return;
				}
				const delta = e.key === 'ArrowDown' ? 1 : -1;
				const nextIndex =
					(highlightedIndex + delta + options.length) % options.length;
				setHighlightedIndex(nextIndex);
			} else if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				if (isOpen && highlightedIndex >= 0) {
					const opt = options[highlightedIndex];
					if (opt && !opt.disabled) {
						onChange?.(opt.value);
						setIsOpen(false);
					}
				} else {
					setIsOpen(!isOpen);
				}
			} else if (e.key === 'Escape') {
				setIsOpen(false);
			}
		};

		return (
			<div ref={containerRef} className={cn('relative w-full', className)}>
				<button
					ref={ref}
					type='button'
					role='combobox'
					aria-expanded={isOpen}
					aria-haspopup='listbox'
					aria-controls={listboxId}
					aria-label={selectedOption ? selectedOption.label : placeholder}
					disabled={disabled}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					onKeyDown={handleKeyDown}
					className={cn(
						'w-full h-10 px-3 bg-surface-card text-foreground border rounded-xl flex items-center justify-between text-sm transition-colors outline-none cursor-pointer',
						error
							? 'border-error text-error'
							: 'border-border-field hover:border-primary focus-visible:border-primary focus-visible:shadow-focus',
						disabled &&
							'opacity-50 cursor-not-allowed border-border-subtle bg-surface-tag'
					)}>
					<span
						className={cn(
							!selectedOption && 'text-placeholder font-normal'
						)}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					<ChevronDown
						className={cn(
							'size-4 text-placeholder transition-transform shrink-0',
							isOpen && 'rotate-180 text-primary'
						)}
					/>
				</button>
				{isOpen && (
					<SelectList
						id={listboxId}
						options={options}
						value={value}
						highlightedIndex={highlightedIndex}
						onHighlight={setHighlightedIndex}
						onSelect={(val) => {
							onChange?.(val);
							setIsOpen(false);
						}}
					/>
				)}
			</div>
		);
	}
);

Select.displayName = 'Select';
