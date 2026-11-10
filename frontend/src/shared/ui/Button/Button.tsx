import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from 'react';

import { cn } from '@/utils';

export const buttonVariants = cva(
	'inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
	{
		variants: {
			variant: {
				primary:
					'bg-primary text-secondary hover:bg-primary-hover focus-visible:ring-primary shadow-primary',
				secondary:
					'bg-transparent text-foreground border border-border-subtle hover:bg-surface-tag focus-visible:ring-primary',
				ghost: 'bg-transparent text-foreground hover:bg-surface-tag focus-visible:ring-primary',
				danger: 'bg-error text-secondary hover:opacity-90 focus-visible:ring-error',
				outline:
					'bg-transparent text-accent border border-primary hover:bg-primary hover:text-secondary focus-visible:ring-primary',
			},
			size: {
				sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
				md: 'h-10 px-4 text-sm rounded-lg gap-2',
				lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
			},
			iconOnly: {
				true: 'px-0 aspect-square justify-center',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
			iconOnly: false,
		},
	}
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
	(
		{
			children,
			className,
			variant,
			size,
			iconOnly,
			isLoading = false,
			disabled,
			type = 'button',
			...props
		},
		ref
	) => {
		const isDisabled = disabled || isLoading;

		return (
			<button
				ref={ref}
				type={type}
				disabled={isDisabled}
				aria-busy={isLoading}
				className={cn(buttonVariants({ variant, size, iconOnly }), className)}
				{...props}>
				{isLoading ? (
					<>
						<Loader2 className='size-4 animate-spin' aria-hidden='true' />
						{!iconOnly && children}
					</>
				) : (
					children
				)}
			</button>
		);
	}
);

Button.displayName = 'Button';
