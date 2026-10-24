'use client';

import { FC, ReactNode, memo, useEffect, useState } from 'react';

import { cn } from '@/utils';

export interface ProseMirrorMark {
	type: string;
	attrs?: Record<string, unknown>;
}

export interface ProseMirrorNodeJSON {
	type: string;
	attrs?: Record<string, unknown>;
	content?: ProseMirrorNodeJSON[];
	marks?: ProseMirrorMark[];
	text?: string;
}

export function sanitizeUrl(url?: unknown): string {
	if (!url || typeof url !== 'string') return '';
	const trimmed = url.trim();
	const lower = trimmed.toLowerCase();

	if (
		lower.startsWith('http://') ||
		lower.startsWith('https://') ||
		lower.startsWith('mailto:') ||
		lower.startsWith('tel:') ||
		lower.startsWith('/') ||
		lower.startsWith('#') ||
		lower.startsWith('data:image/') ||
		lower.startsWith('blob:')
	) {
		return trimmed;
	}

	return '#';
}

function applyMarks(
	element: ReactNode,
	marks?: ProseMirrorMark[],
	keyPrefix = ''
): ReactNode {
	if (!marks || marks.length === 0) return element;

	return marks.reduce<ReactNode>((acc, mark, index) => {
		const key = `${keyPrefix}-mark-${mark.type}-${index}`;
		switch (mark.type) {
			case 'strong':
			case 'bold':
				return <strong key={key}>{acc}</strong>;
			case 'em':
			case 'italic':
				return <em key={key}>{acc}</em>;
			case 'strike':
				return <s key={key}>{acc}</s>;
			case 'code':
				return (
					<code
						key={key}
						className='rounded bg-[var(--background-color-main)] px-1.5 py-0.5 font-mono text-sm'>
						{acc}
					</code>
				);
			case 'link': {
				const href = sanitizeUrl(mark.attrs?.href);
				return (
					<a
						key={key}
						href={href}
						target='_blank'
						rel='noopener noreferrer'
						className='text-primary underline hover:opacity-80 transition-opacity'>
						{acc}
					</a>
				);
			}
			default:
				return acc;
		}
	}, element);
}

function renderNode(
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
		return applyMarks(textContent, node.marks, key);
	}

	switch (node.type) {
		case 'doc':
			return (
				<div key={key} className='prose-mirror-doc'>
					{renderChildren(node.content)}
				</div>
			);

		case 'paragraph':
			return (
				<p
					key={key}
					className='mb-4 leading-relaxed text-[var(--text-color-main)]'>
					{renderChildren(node.content)}
				</p>
			);

		case 'heading': {
			const level = Number(node.attrs?.level) || 1;
			const children = renderChildren(node.content);
			switch (level) {
				case 1:
					return (
						<h1
							key={key}
							className='font-title font-bold leading-[110%] text-3xl md:text-4xl mb-4 mt-6 text-[var(--text-color-main)]'>
							{children}
						</h1>
					);
				case 2:
					return (
						<h2
							key={key}
							className='font-title font-bold leading-[115%] text-2xl md:text-3xl mb-3 mt-5 text-[var(--text-color-main)]'>
							{children}
						</h2>
					);
				case 3:
					return (
						<h3
							key={key}
							className='font-title font-bold leading-[120%] text-xl md:text-2xl mb-2 mt-4 text-[var(--text-color-main)]'>
							{children}
						</h3>
					);
				case 4:
					return (
						<h4
							key={key}
							className='font-title font-bold text-lg md:text-xl mb-2 mt-3 text-[var(--text-color-main)]'>
							{children}
						</h4>
					);
				case 5:
					return (
						<h5
							key={key}
							className='font-title font-bold text-base md:text-lg mb-1 mt-2 text-[var(--text-color-main)]'>
							{children}
						</h5>
					);
				case 6:
				default:
					return (
						<h6
							key={key}
							className='font-title font-bold text-sm md:text-base mb-1 mt-2 text-[var(--text-color-main)]'>
							{children}
						</h6>
					);
			}
		}

		case 'blockquote':
			return (
				<blockquote
					key={key}
					className='border-l-4 border-primary pl-4 italic my-4 text-[var(--text-color-main)]/90'>
					{renderChildren(node.content)}
				</blockquote>
			);

		case 'bullet_list':
			return (
				<ul
					key={key}
					className='list-disc pl-6 mb-4 space-y-1 text-[var(--text-color-main)]'>
					{renderChildren(node.content)}
				</ul>
			);

		case 'ordered_list':
			return (
				<ol
					key={key}
					className='list-decimal pl-6 mb-4 space-y-1 text-[var(--text-color-main)]'>
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
					className='overflow-auto rounded-sm bg-[var(--background-color-main)] whitespace-pre mb-2 transition-colors p-5'>
					<code
						className={cn(
							'text-wrap text-[var(--text-color-main)]',
							language && `language-${language}`
						)}>
						{renderChildren(node.content)}
					</code>
				</pre>
			);
		}

		case 'image':
		case 'image_block': {
			const src = sanitizeUrl(node.attrs?.src);
			if (!src || src === '#') return null;
			const caption =
				typeof node.attrs?.caption === 'string'
					? node.attrs.caption
					: undefined;

			if (caption) {
				return (
					<figure
						key={key}
						className='flex flex-col items-center w-full my-4'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={src}
							alt={caption}
							className='mb-1 rounded max-h-[500px] object-contain w-auto h-auto'
							loading='lazy'
						/>
						<figcaption className='text-sm text-neutral-500 mt-1'>
							{caption}
						</figcaption>
					</figure>
				);
			}

			return (
				<div key={key} className='flex justify-center w-full my-4'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={src}
						alt=''
						className='rounded max-h-[500px] object-contain w-auto h-auto'
						loading='lazy'
					/>
				</div>
			);
		}

		case 'hard_break':
			return <br key={key} />;

		case 'horizontal_rule':
			return (
				<hr
					key={key}
					className='my-6 border-[var(--border-color,rgba(0,0,0,0.1))]'
				/>
			);

		default:
			if (node.content && node.content.length > 0) {
				return (
					<div key={key}>{renderChildren(node.content)}</div>
				);
			}
			return null;
	}
}

function parseDocInput(doc: unknown): {
	parsed: ProseMirrorNodeJSON | null;
	raw: string | null;
} {
	if (!doc) return { parsed: null, raw: null };

	if (typeof doc === 'string') {
		try {
			return { parsed: JSON.parse(doc), raw: null };
		} catch {
			return { parsed: null, raw: doc };
		}
	}

	if (typeof doc === 'object') {
		return { parsed: doc as ProseMirrorNodeJSON, raw: null };
	}

	return { parsed: null, raw: null };
}

export interface ProseMirrorRendererProps {
	doc: unknown;
	className?: string;
}

export const ProseMirrorRenderer: FC<ProseMirrorRendererProps> = memo(
	({ doc, className }) => {
		const [parsedDoc, setParsedDoc] = useState<ProseMirrorNodeJSON | null>(
			() => parseDocInput(doc).parsed
		);
		const [rawText, setRawText] = useState<string | null>(
			() => parseDocInput(doc).raw
		);

		useEffect(() => {
			const { parsed, raw } = parseDocInput(doc);
			setParsedDoc(parsed);
			setRawText(raw);
		}, [doc]);

		if (!doc) return null;

		if (rawText) {
			return (
				<div className={cn('prose-mirror-doc', className)}>
					<p className='leading-relaxed text-[var(--text-color-main)]'>
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
