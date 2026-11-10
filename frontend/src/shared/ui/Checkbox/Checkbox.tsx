import { Check, Minus } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';

import { cn } from '@/utils';

export interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: ReactNode;
	indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{
			className,
			label,
			checked,
			indeterminate = false,
			disabled = false,
			id,
			onChange,
			...props
		},
		ref
	) => {
		const generatedId = useId();
		const inputId = id || generatedId;
		const isChecked = Boolean(checked);

		return (
			<label
				htmlFor={inputId}
				className={cn(
					'inline-flex items-center gap-2.5 cursor-pointer select-none text-sm font-text transition-colors',
					disabled && 'cursor-not-allowed opacity-50',
					className
				)}>
				<div className='relative flex items-center justify-center'>
					<input
						ref={ref}
						id={inputId}
						type='checkbox'
						checked={isChecked}
						disabled={disabled}
						aria-checked={indeterminate ? 'mixed' : isChecked}
						onChange={onChange}
						className='sr-only'
						{...props}
					/>
					<div
						className={cn(
							'size-5 rounded-md border flex items-center justify-center transition-all',
							isChecked || indeterminate
								? 'bg-primary border-primary text-secondary'
								: 'bg-surface-card border-border-field hover:border-primary',
							disabled && 'border-border-subtle bg-surface-tag'
						)}>
						{indeterminate ? (
							<Minus className='size-3.5 stroke-[2.5]' />
						) : isChecked ? (
							<Check className='size-3.5 stroke-[2.5]' />
						) : null}
					</div>
				</div>
				{label && <span className='text-foreground'>{label}</span>}
			</label>
		);
	}
);

Checkbox.displayName = 'Checkbox';
