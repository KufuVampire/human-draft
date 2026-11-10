import type { ReactNode } from 'react';

import type { ProseMirrorMark, ProseMirrorNodeJSON } from './types';

export function sanitizeLinkUrl(url?: unknown): string {
	if (!url || typeof url !== 'string') return '';
	const trimmed = url.trim();
	const lower = trimmed.toLowerCase();

	if (
		lower.startsWith('http://') ||
		lower.startsWith('https://') ||
		lower.startsWith('mailto:') ||
		lower.startsWith('tel:') ||
		lower.startsWith('/') ||
		lower.startsWith('#')
	) {
		return trimmed;
	}

	return '#';
}

export function sanitizeImageUrl(url?: unknown): string {
	if (!url || typeof url !== 'string') return '';
	const trimmed = url.trim();
	const lower = trimmed.toLowerCase();

	// Disallow all data:image/svg variants to prevent SVG XSS inside img tags
	if (lower.startsWith('data:image/svg')) {
		return '#';
	}

	if (
		lower.startsWith('http://') ||
		lower.startsWith('https://') ||
		lower.startsWith('/') ||
		lower.startsWith('#') ||
		lower.startsWith('data:image/') ||
		lower.startsWith('blob:')
	) {
		return trimmed;
	}

	return '#';
}

export function applyMarks(
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
						className='rounded bg-surface-base px-1.5 py-0.5 font-mono text-sm'>
						{acc}
					</code>
				);
			case 'link': {
				const href = sanitizeLinkUrl(mark.attrs?.href);
				return (
					<a
						key={key}
						href={href}
						target='_blank'
						rel='noopener noreferrer'
						className='text-accent underline hover:opacity-80 transition-opacity'>
						{acc}
					</a>
				);
			}
			default:
				return acc;
		}
	}, element);
}

export function parseDocInput(doc: unknown): {
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
