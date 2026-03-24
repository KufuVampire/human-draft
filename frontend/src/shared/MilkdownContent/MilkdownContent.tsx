'use client';

import { memo } from 'react';

import { cn } from '@/utils';

interface Props {
	content: string;
	className?: string;
}

export const MilkdownContent = memo(
	({ content, className }: Props) => {
		return (
			<div
				className={cn(
					'milkdown-content',
					className
				)}
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		);
	},
	(prev, next) => prev.content === next.content
);

MilkdownContent.displayName = 'MilkdownContent';
