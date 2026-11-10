import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/utils';

export const badgeVariants = cva(
	'inline-flex items-center gap-1.5 rounded-full font-medium select-none transition-colors leading-none',
	{
		variants: {
			variant: {
				default: 'bg-surface-tag text-foreground',
				primary: 'bg-primary/15 text-accent border border-primary/25',
				success:
					'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
				warning:
					'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
				error: 'bg-error/15 text-error border border-error/25',
				outline:
					'bg-transparent text-foreground border border-border-subtle',
			},
			size: {
				sm: 'px-2 py-0.5 text-[11px]',
				md: 'px-2.5 py-1 text-xs',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	}
);

export interface BadgeProps
	extends HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {
	onRemove?: () => void;
}

export const Badge = ({
	variant,
	size,
	onRemove,
	className,
	children,
	...props
}: PropsWithChildren<BadgeProps>) => {
	return (
		<span className={cn(badgeVariants({ variant, size }), className)} {...props}>
			{children}
			{onRemove && (
				<button
					type='button'
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					aria-label='Удалить'
					className='hover:opacity-70 cursor-pointer -mr-0.5 p-0.5 rounded-full'>
					<X className='size-3' />
				</button>
			)}
		</span>
	);
};
