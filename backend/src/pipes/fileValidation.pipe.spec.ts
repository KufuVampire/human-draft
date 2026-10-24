import { BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';

import { FileValidationPipe } from './fileValidation.pipe';

describe('FileValidationPipe (unit tests)', () => {
	let pipe: FileValidationPipe;

	beforeEach(() => {
		pipe = new FileValidationPipe();
	});

	it('should be defined', () => {
		expect(pipe).toBeDefined();
	});

	it('should return null if value is falsy', async () => {
		const result = await pipe.transform(null);
		expect(result).toBeNull();
	});

	it('should throw BadRequestException if filename is missing', async () => {
		await expect(pipe.transform({})).rejects.toThrow(BadRequestException);
	});

	it('should throw BadRequestException for unsupported file extensions', async () => {
		await expect(
			pipe.transform({
				filename: 'malicious.exe',
				createReadStream: () => Readable.from(['fake content']),
			})
		).rejects.toThrow(BadRequestException);
	});

	it('should accept valid image format and size', async () => {
		const validFile = {
			filename: 'avatar.png',
			createReadStream: () => Readable.from(['image data']),
		};

		const result = await pipe.transform(validFile);
		expect(result).toBe(validFile);
	});
});
