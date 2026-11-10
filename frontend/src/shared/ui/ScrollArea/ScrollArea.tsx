import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/utils';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
	maxHeight?: string | number;
}

export const ScrollArea = ({
	maxHeight = 320,
	className,
	style,
	children,
	...props
}: PropsWithChildren<ScrollAreaProps>) => {
	const customStyle = {
		maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
		...style,
	};

	return (
		<div
			style={customStyle}
			tabIndex={0}
			className={cn(
				'relative overflow-y-auto overflow-x-hidden w-full outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl',
				className
			)}
			{...props}>
			{children}
		</div>
	);
};
