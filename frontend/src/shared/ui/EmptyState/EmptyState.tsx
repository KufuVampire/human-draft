import { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: ReactNode;
}

export const EmptyState = ({
	icon,
	title,
	description,
	action,
	className,
	...props
}: EmptyStateProps) => {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center text-center p-8 rounded-card border border-border-subtle bg-surface-card gap-3 max-w-md mx-auto my-6',
				className
			)}
			{...props}>
			{icon && (
				<div className='p-3.5 rounded-full bg-surface-tag text-placeholder mb-1'>
					{icon}
				</div>
			)}
			<h3 className='text-base font-title font-bold text-foreground'>
				{title}
			</h3>
			{description && (
				<p className='text-sm text-placeholder max-w-xs leading-relaxed'>
					{description}
				</p>
			)}
			{action && <div className='mt-2'>{action}</div>}
		</div>
	);
};
