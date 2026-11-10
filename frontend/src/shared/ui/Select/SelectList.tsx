import { SelectOption } from './Select';
import { cn } from '@/utils';

export interface SelectListProps {
	id: string;
	options: SelectOption[];
	value?: string;
	highlightedIndex: number;
	onSelect: (val: string) => void;
	onHighlight: (idx: number) => void;
}

export const SelectList = ({
	id,
	options,
	value,
	highlightedIndex,
	onSelect,
	onHighlight,
}: SelectListProps) => {
	return (
		<ul
			id={id}
			role='listbox'
			className='absolute z-dropdown mt-1.5 w-full max-h-60 overflow-y-auto rounded-xl border border-border-subtle bg-surface-card p-1 shadow-primary outline-none'>
			{options.map((opt, idx) => (
				<li
					key={opt.value}
					role='option'
					aria-selected={opt.value === value}
					aria-disabled={opt.disabled}
					onClick={() => {
						if (!opt.disabled) onSelect(opt.value);
					}}
					onMouseEnter={() => onHighlight(idx)}
					className={cn(
						'px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors select-none flex items-center justify-between',
						opt.value === value && 'bg-primary text-secondary font-medium',
						highlightedIndex === idx &&
							opt.value !== value &&
							'bg-surface-tag',
						opt.disabled && 'opacity-40 cursor-not-allowed'
					)}>
					{opt.label}
				</li>
			))}
		</ul>
	);
};
