import type { ReactNode } from 'react';

import type { ProseMirrorNodeJSON } from './types';
import { sanitizeImageUrl } from './utils';

export function renderMedia(
	node: ProseMirrorNodeJSON,
	key: string
): ReactNode {
	switch (node.type) {
		case 'image':
		case 'image_block': {
			const src = sanitizeImageUrl(node.attrs?.src);
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
							className='mb-1 rounded-xl max-h-125 object-contain w-auto h-auto border border-border-subtle shadow-sm'
							loading='lazy'
						/>
						<figcaption className='text-sm text-foreground-muted mt-1'>
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
						className='rounded-xl max-h-125 object-contain w-auto h-auto border border-border-subtle shadow-sm'
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
					className='my-6 border-border-subtle'
				/>
			);

		default:
			return null;
	}
}
