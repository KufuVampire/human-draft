'use client';

import { memo } from 'react';

export const MilkdownContent = memo(
	({ content }: { content: string }) => {
		return (
			<div
				className='milkdown-content'
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		);
	},
	(prev, next) => prev.content === next.content
);

MilkdownContent.displayName = 'MilkdownContent';
