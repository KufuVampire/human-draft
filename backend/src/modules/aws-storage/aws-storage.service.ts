import {
	DeleteObjectCommand,
	DeleteObjectCommandInput,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from 'graphql-upload-ts';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';

import { readStreamWithLimit, validateNoGif } from '@/src/utils';

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
			Key: this.extractKey(key),
			Body: buffer,
			ContentType: mimetype,
			ACL: 'public-read',
		};

		await this.client.send(new PutObjectCommand(command));
	}

	public async uploadForPost(file: FileUpload, mimetype?: 'image/webp') {
		if (!file) {
			throw new BadRequestException('The file was not transferred');
		}

		validateNoGif(file.filename, file.mimetype);

		const buffer = await readStreamWithLimit(file.createReadStream());

		const imageId = uuidv4();
		const key = `posts/${imageId}-${Date.now()}.webp`;

		const processesBuffer = await sharp(buffer).webp().toBuffer();

		const command: PutObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
			Body: processesBuffer,
			ContentType: mimetype,
			ACL: 'public-read',
		};

		await this.client.send(new PutObjectCommand(command));

		return { url: this.getFileUrl(key) };
	}

	public async remove(keyOrUrl: string) {
		const key = this.extractKey(keyOrUrl);
		if (!key) {
			return;
		}

		const command: DeleteObjectCommandInput = {
			Bucket: this.bucket,
			Key: key,
		};

		await this.client.send(new DeleteObjectCommand(command));
	}

	public extractKey(keyOrUrl: string): string {
		if (!keyOrUrl) return '';
		try {
			if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) {
				const parsed = new URL(keyOrUrl);
				return decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
			}
		} catch {
			// ignore URL parse errors and fall through
		}
		return keyOrUrl.replace(/^\/+/, '');
	}

	public getFileUrl(key: string) {
		const cleanKey = this.extractKey(key);
		return `https://${this.bucket}.s3.amazonaws.com/${cleanKey}`;
	}
}
