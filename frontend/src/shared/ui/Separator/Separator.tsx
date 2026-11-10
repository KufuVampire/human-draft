import { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: 'horizontal' | 'vertical';
	decorative?: boolean;
}

export const Separator = ({
	orientation = 'horizontal',
	decorative = false,
	className,
	...props
}: SeparatorProps) => {
	const isHorizontal = orientation === 'horizontal';

	return (
		<div
			role={decorative ? 'none' : 'separator'}
			aria-orientation={decorative ? undefined : orientation}
			className={cn(
				'shrink-0 bg-border-subtle',
				isHorizontal ? 'h-px w-full' : 'w-px h-full self-stretch',
				className
			)}
			{...props}
		/>
	);
};
