import {
	DeleteObjectCommand,
	DeleteObjectCommandInput,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client,
} from '@aws-sdk/client-s3';
import {
	BadRequestException,
	ConflictException,
	Injectable,
	UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from 'graphql-upload-ts';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AwsStorageService {
	private readonly client: S3Client;
	private readonly bucket: string;

	public constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService
	) {
		this.client = new S3Client({
			region: this.configService.getOrThrow<string>('S3_REGION'),
			credentials: {
				accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.getOrThrow<string>(
					'S3_SECRET_ACCESS_KEY'
				),
			},
		});

		this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
	}

	public async uploadForProfile(
		buffer: Buffer,
		key: string,
		mimetype: 'image/webp'
	) {
		const command: PutObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
			Body: buffer,
			ContentType: mimetype,
			ACL: 'public-read-write',
		};

		await this.client.send(new PutObjectCommand(command));
	}

	public async uploadForPost(
		file: FileUpload,
		mimetype?: 'image/webp'
	) {
		if (!file) {
			throw new BadRequestException('The file was not transferred');
		}

		const chunks: Buffer[] = [];

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);

		const imageId = uuidv4();
		const key = `posts/${imageId}-${Date.now()}.webp`;
		if (file.filename && file.filename.startsWith('.gif')) {
			throw new UnsupportedMediaTypeException('Unsuppoarted file type');
		}

		const processesBuffer = await sharp(buffer).webp().toBuffer();

		const command: PutObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
			Body: processesBuffer,
			ContentType: mimetype,
			ACL: 'public-read-write',
		};

		await this.client.send(new PutObjectCommand(command));

		return { url: this.getFileUrl(key) };
	}

	public async remove(key: string) {
		const command: DeleteObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
		};

		await this.client.send(new DeleteObjectCommand(command));
	}

	public getFileUrl(key: string) {
		return `https://${this.bucket}.s3.amazonaws.com/${key}`;
	}
}
