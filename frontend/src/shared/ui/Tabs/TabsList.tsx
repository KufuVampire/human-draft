import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/utils';

export const TabsList = ({
	className,
	children,
	...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
	return (
		<div
			role='tablist'
			className={cn(
				'inline-flex items-center gap-1 p-1 rounded-xl bg-surface-tag border border-border-subtle w-fit select-none',
				className
			)}
			{...props}>
			{children}
		</div>
	);
};
