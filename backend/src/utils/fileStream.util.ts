import {
	PayloadTooLargeException,
	UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Readable } from 'stream';

import { MAX_FILE_SIZE } from '../consts';

export function validateNoGif(filename?: string, mimetype?: string): void {
	const isGifExtension = filename
		? filename.toLowerCase().endsWith('.gif')
		: false;
	const isGifMime = mimetype ? mimetype.toLowerCase() === 'image/gif' : false;

	if (isGifExtension || isGifMime) {
		throw new UnsupportedMediaTypeException('Unsupported file type');
	}
}

export async function readStreamWithLimit(
	stream: Readable,
	maxSize: number = MAX_FILE_SIZE
): Promise<Buffer> {
	const chunks: Buffer[] = [];
	let totalBytes = 0;

	for await (const chunk of stream) {
		const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		totalBytes += bufferChunk.length;

		if (totalBytes > maxSize) {
			if (typeof (stream as any).destroy === 'function') {
				(stream as any).destroy();
			}
			throw new PayloadTooLargeException(
				`File size exceeds the limit of ${maxSize} bytes`
			);
		}

		chunks.push(bufferChunk);
	}

	return Buffer.concat(chunks);
}
