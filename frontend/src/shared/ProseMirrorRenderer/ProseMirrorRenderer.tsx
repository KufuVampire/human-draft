'use client';

import { FC, memo, useMemo } from 'react';

import { renderNode } from './renderNode';
import type { ProseMirrorRendererProps } from './types';
import { parseDocInput } from './utils';
import { cn } from '@/utils';

export type {
	ProseMirrorMark,
	ProseMirrorNodeJSON,
	ProseMirrorRendererProps,
} from './types';
export { sanitizeImageUrl, sanitizeLinkUrl } from './utils';

export const ProseMirrorRenderer: FC<ProseMirrorRendererProps> = memo(
	({ doc, className }) => {
		const { parsed: parsedDoc, raw: rawText } = useMemo(
			() => parseDocInput(doc),
			[doc]
		);

		if (!doc) return null;

		if (rawText) {
			return (
				<div className={cn('prose-mirror-doc', className)}>
					<p className='leading-relaxed text-foreground'>
						{rawText}
					</p>
				</div>
			);
		}

		if (!parsedDoc) return null;

		return (
			<div className={cn('prose-mirror-doc', className)}>
				{renderNode(parsedDoc, 0, 'root')}
			</div>
		);
	}
);

ProseMirrorRenderer.displayName = 'ProseMirrorRenderer';
