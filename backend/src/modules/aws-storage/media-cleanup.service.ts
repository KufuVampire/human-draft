import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AwsStorageService } from './aws-storage.service';
import { PrismaService } from '../prisma/prisma.service';

import { MediaStatus } from '@/prisma/generated/enums';

@Injectable()
export class MediaCleanupService {
	private readonly logger = new Logger(MediaCleanupService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly storage: AwsStorageService
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async cleanupStalePendingMedia(
		maxAgeMs = 24 * 60 * 60 * 1000
	): Promise<{ deletedCount: number }> {
		const threshold = new Date(Date.now() - maxAgeMs);

		const staleAttachments = await this.prisma.mediaAttachment.findMany({
			where: {
				status: MediaStatus.PENDING,
				createdAt: {
					lt: threshold,
				},
			},
			select: {
				id: true,
				key: true,
			},
		});

		if (staleAttachments.length === 0) {
			this.logger.log('No stale pending media attachments found to clean up.');
			return { deletedCount: 0 };
		}

		this.logger.log(
			`Found ${staleAttachments.length} stale pending media attachment(s) older than 24h. Cleaning up...`
		);

		const keys = staleAttachments.map((attachment) => attachment.key);
		await this.storage.removeMany(keys);

		const deleteResult = await this.prisma.mediaAttachment.deleteMany({
			where: {
				id: {
					in: staleAttachments.map((attachment) => attachment.id),
				},
			},
		});

		this.logger.log(
			`Successfully cleaned up ${deleteResult.count} stale pending media attachment(s) from S3 and database.`
		);

		return { deletedCount: deleteResult.count };
	}
}
