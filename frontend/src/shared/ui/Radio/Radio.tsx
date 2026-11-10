import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';

import { useRadioGroup } from './RadioGroup';
import { cn } from '@/utils';

export interface RadioProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: ReactNode;
	value: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
	({ className, label, value, disabled = false, id, ...props }, ref) => {
		const generatedId = useId();
		const group = useRadioGroup();
		const radioId = id || generatedId;

		const isChecked = group ? group.value === value : props.checked;
		const isDisabled = disabled || group?.disabled || false;
		const name = group?.name || props.name;

		const handleChange = () => {
			if (isDisabled) return;
			group?.onChange?.(value);
		};

		return (
			<label
				htmlFor={radioId}
				className={cn(
					'inline-flex items-center gap-2.5 cursor-pointer select-none text-sm font-text transition-colors',
					isDisabled && 'cursor-not-allowed opacity-50',
					className
				)}>
				<div className='relative flex items-center justify-center'>
					<input
						ref={ref}
						id={radioId}
						type='radio'
						name={name}
						value={value}
						checked={isChecked}
						disabled={isDisabled}
						onChange={handleChange}
						className='sr-only'
						{...props}
					/>
					<div
						className={cn(
							'size-5 rounded-full border flex items-center justify-center transition-all',
							isChecked
								? 'border-primary bg-primary'
								: 'bg-surface-card border-border-field hover:border-primary',
							isDisabled && 'border-border-subtle bg-surface-tag'
						)}>
						{isChecked && (
							<div className='size-2 rounded-full bg-secondary' />
						)}
					</div>
				</div>
				{label && <span className='text-foreground'>{label}</span>}
			</label>
		);
	}
);

Radio.displayName = 'Radio';
