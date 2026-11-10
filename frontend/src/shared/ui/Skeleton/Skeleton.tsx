import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export const skeletonVariants = cva('bg-surface-tag animate-pulse shrink-0', {
	variants: {
		variant: {
			text: 'h-4 w-full rounded-md',
			circular: 'rounded-full aspect-square',
			rectangular: 'rounded-xl',
		},
	},
	defaultVariants: {
		variant: 'rectangular',
	},
});

export interface SkeletonProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof skeletonVariants> {
	width?: string | number;
	height?: string | number;
}

export const Skeleton = ({
	variant,
	width,
	height,
	className,
	style,
	...props
}: SkeletonProps) => {
	const customStyle = {
		width: typeof width === 'number' ? `${width}px` : width,
		height: typeof height === 'number' ? `${height}px` : height,
		...style,
	};

	return (
		<div
			role='status'
			aria-hidden='true'
			style={customStyle}
			className={cn(skeletonVariants({ variant }), className)}
			{...props}
		/>
	);
};
