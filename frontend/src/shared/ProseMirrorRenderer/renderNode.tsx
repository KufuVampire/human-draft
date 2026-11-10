import { Fragment, type ReactNode } from 'react';

import { renderHeading } from './renderHeading';
import { renderMedia } from './renderMedia';
import type { ProseMirrorNodeJSON } from './types';
import { applyMarks } from './utils';
import { cn } from '@/utils';

export function renderNode(
	node: ProseMirrorNodeJSON,
	index: number,
	parentKey = 'root'
): ReactNode {
	const key = `${parentKey}-${node.type}-${index}`;

	const renderChildren = (content?: ProseMirrorNodeJSON[]) => {
		if (!content || !Array.isArray(content)) return null;
		return content.map((child, childIdx) =>
			renderNode(child, childIdx, key)
		);
	};

	if (node.type === 'text') {
		const textContent = node.text ?? '';
		return (
			<Fragment key={key}>
				{applyMarks(textContent, node.marks, key)}
			</Fragment>
		);
	}

	switch (node.type) {
		case 'doc':
			return (
				<Fragment key={key}>
					{renderChildren(node.content)}
				</Fragment>
			);

		case 'paragraph':
			return (
				<p
					key={key}
					className='mb-4 leading-relaxed text-foreground'>
					{renderChildren(node.content)}
				</p>
			);

		case 'heading': {
			const level = Number(node.attrs?.level) || 1;
			return renderHeading(level, key, renderChildren(node.content));
		}

		case 'blockquote':
			return (
				<blockquote
					key={key}
					className='border-l-4 border-primary pl-4 italic my-4 text-foreground/90'>
					{renderChildren(node.content)}
				</blockquote>
			);

		case 'bullet_list':
			return (
				<ul
					key={key}
					className='list-disc pl-6 mb-4 space-y-1 text-foreground'>
					{renderChildren(node.content)}
				</ul>
			);

		case 'ordered_list':
			return (
				<ol
					key={key}
					className='list-decimal pl-6 mb-4 space-y-1 text-foreground'>
					{renderChildren(node.content)}
				</ol>
			);

		case 'list_item':
			return (
				<li key={key} className='leading-relaxed'>
					{renderChildren(node.content)}
				</li>
			);

		case 'code_block': {
			const language =
				typeof node.attrs?.language === 'string'
					? node.attrs.language
					: undefined;
			return (
				<pre
					key={key}
					className='overflow-auto rounded-sm bg-surface-base whitespace-pre mb-2 transition-colors p-5'>
					<code
						className={cn(
							'text-wrap text-foreground',
							language && `language-${language}`
						)}>
						{renderChildren(node.content)}
					</code>
				</pre>
			);
		}

		case 'image':
		case 'image_block':
		case 'hard_break':
		case 'horizontal_rule':
			return renderMedia(node, key);

		default:
			if (node.content && node.content.length > 0) {
				return (
					<Fragment key={key}>{renderChildren(node.content)}</Fragment>
				);
			}
			return null;
	}
}
