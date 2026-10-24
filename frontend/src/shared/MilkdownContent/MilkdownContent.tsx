'use client';

import { memo } from 'react';

import { ProseMirrorRenderer } from '../ProseMirrorRenderer';
import { cn } from '@/utils';

interface Props {
	content: unknown;
	className?: string;
}

export const MilkdownContent = memo(
	({ content, className }: Props) => {
		return (
			<ProseMirrorRenderer
				doc={content}
				className={cn('milkdown-content', className)}
			/>
		);
	},
	(prev, next) => prev.content === next.content && prev.className === next.className
);

MilkdownContent.displayName = 'MilkdownContent';
