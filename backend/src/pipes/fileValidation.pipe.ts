import {
	type ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import { ReadStream } from 'fs';

import { MAX_FILE_SIZE } from '../consts';
import { validateFileFormat, validateFileSize } from '../utils';

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: any, metadata: ArgumentMetadata) {
		if (!value.filename) {
			throw new BadRequestException('File not uploaded');
		}

		const { filename, createReadStream } = value;

		const fileStream = createReadStream() as ReadStream;

		const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
		const isFileFormatValid = validateFileFormat(filename, allowedFormats);

		if (!isFileFormatValid) {
			throw new BadRequestException('Unsupported file type');
		}

		const isFileSizeValid = await validateFileSize(fileStream, MAX_FILE_SIZE);

		if (!isFileSizeValid) {
			throw new BadRequestException('File size more than 10 mb');
		}

		return value;
	}
}
