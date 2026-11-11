import { Check, Minus } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';

import { cn } from '@/utils';

export interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: ReactNode;
	indeterminate?: boolean;
}

/**
 * Чекбокс UI Kit. Работает и управляемым (`checked` + `onChange`), и
 * неуправляемым (например, через `register()` react-hook-form): отметка
 * рисуется по состоянию самого input через `peer-checked`.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{
			className,
			label,
			checked,
			indeterminate = false,
			disabled = false,
			id,
			...props
		},
		ref
	) => {
		const generatedId = useId();
		const inputId = id || generatedId;

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
						checked={checked}
						disabled={disabled}
						aria-checked={indeterminate ? 'mixed' : undefined}
						className='peer sr-only'
						{...props}
					/>
					<div
						className={cn(
							'size-5 rounded-md border flex items-center justify-center transition-all',
							'bg-surface-card border-border-field hover:border-primary',
							'peer-checked:bg-primary peer-checked:border-primary peer-checked:text-on-primary',
							'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40',
							'peer-disabled:border-border-subtle peer-disabled:bg-surface-tag',
							indeterminate && 'bg-primary border-primary text-on-primary'
						)}>
						{indeterminate && <Minus className='size-3.5 stroke-[2.5]' />}
					</div>
					{!indeterminate && (
						<Check className='absolute size-3.5 stroke-[2.5] text-on-primary pointer-events-none hidden peer-checked:block' />
					)}
				</div>
				{label && <span className='text-foreground'>{label}</span>}
			</label>
		);
	}
);

Checkbox.displayName = 'Checkbox';
