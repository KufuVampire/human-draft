import {
	PayloadTooLargeException,
	UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Readable } from 'stream';
import { describe, expect, it } from 'vitest';

import { readStreamWithLimit, validateNoGif } from './fileStream.util';

describe('fileStream.util', () => {
	describe('validateNoGif', () => {
		it('Выбрасывает UnsupportedMediaTypeException для файлов с расширением .gif (в любом регистре и с пробелами)', () => {
			expect(() => validateNoGif('image.gif')).toThrow(
				UnsupportedMediaTypeException
			);
			expect(() => validateNoGif('animation.GIF')).toThrow(
				UnsupportedMediaTypeException
			);
			expect(() => validateNoGif('image.gif ')).toThrow(
				UnsupportedMediaTypeException
			);
		});

		it('Выбрасывает UnsupportedMediaTypeException для mimetype image/gif (с триммингом)', () => {
			expect(() => validateNoGif('file.png', 'image/gif')).toThrow(
				UnsupportedMediaTypeException
			);
			expect(() => validateNoGif('file.png', ' image/gif ')).toThrow(
				UnsupportedMediaTypeException
			);
		});

		it('Не выбрасывает исключение для допустимых форматов', () => {
			expect(() => validateNoGif('image.png', 'image/png')).not.toThrow();
			expect(() => validateNoGif('photo.webp', 'image/webp')).not.toThrow();
			expect(() => validateNoGif('avatar.jpeg', 'image/jpeg')).not.toThrow();
		});
	});

	describe('readStreamWithLimit', () => {
		it('Успешно считывает поток в Buffer, если размер не превышает лимит', async () => {
			const stream = Readable.from([
				Buffer.from('hello '),
				Buffer.from('world'),
			]);
			const buffer = await readStreamWithLimit(stream, 1024);

			expect(buffer.toString('utf-8')).toBe('hello world');
		});

		it('Выбрасывает PayloadTooLargeException и прерывает поток при превышении лимита', async () => {
			let isDestroyed = false;
			const stream = new Readable({
				read() {
					this.push(Buffer.alloc(600, 'a'));
					this.push(Buffer.alloc(600, 'b'));
				},
				destroy(err, callback) {
					isDestroyed = true;
					callback(err);
				},
			});

			await expect(readStreamWithLimit(stream, 1000)).rejects.toThrow(
				PayloadTooLargeException
			);
			expect(isDestroyed).toBe(true);
		});
	});
});
