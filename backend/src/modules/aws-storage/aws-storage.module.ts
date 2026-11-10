import { Global, Module } from '@nestjs/common';

import { AwsStorageResolver } from './aws-storage.resolver';
import { AwsStorageService } from './aws-storage.service';
import { MediaCleanupService } from './media-cleanup.service';

@Global()
@Module({
	providers: [AwsStorageService, AwsStorageResolver, MediaCleanupService],
	exports: [AwsStorageService, MediaCleanupService],
})
export class AwsStorageModule {}
