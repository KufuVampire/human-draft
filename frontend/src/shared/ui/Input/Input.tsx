import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils';

export const inputVariants = cva(
	'w-full bg-surface-card text-foreground placeholder:text-placeholder outline-none transition-colors border rounded-xl flex items-center font-text',
	{
		variants: {
			size: {
				sm: 'h-8 px-2.5 text-xs gap-1.5',
				md: 'h-10 px-3 text-sm gap-2',
				lg: 'h-12 px-4 text-base gap-2.5',
			},
			state: {
				default:
					'border-border-field focus-within:border-primary focus-within:shadow-focus',
				error: 'border-error text-error focus-within:border-error',
				disabled:
					'opacity-50 cursor-not-allowed border-border-subtle bg-surface-tag select-none',
			},
		},
		defaultVariants: {
			size: 'md',
			state: 'default',
		},
	}
);

export interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>,
		VariantProps<typeof inputVariants> {
	iconLeft?: ReactNode;
	iconRight?: ReactNode;
	prefixText?: string;
	error?: boolean | string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			size,
			iconLeft,
			iconRight,
			prefixText,
			error,
			disabled,
			type = 'text',
			...props
		},
		ref
	) => {
		const state = disabled ? 'disabled' : error ? 'error' : 'default';

		return (
			<div className={cn(inputVariants({ size, state }), className)}>
				{iconLeft && (
					<span className='shrink-0 text-placeholder'>{iconLeft}</span>
				)}
				{prefixText && (
					<span className='shrink-0 text-placeholder select-none'>
						{prefixText}
					</span>
				)}
				<input
					ref={ref}
					type={type}
					disabled={disabled}
					aria-invalid={Boolean(error)}
					className='w-full bg-transparent outline-none disabled:cursor-not-allowed'
					{...props}
				/>
				{iconRight && (
					<span className='shrink-0 text-placeholder'>{iconRight}</span>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';
