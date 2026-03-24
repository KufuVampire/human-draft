import { Global, Module } from '@nestjs/common';

import { AwsStorageService } from './aws-storage.service';
import { AwsStorageResolver } from './aws-storage.resolver';

@Global()
@Module({
	providers: [AwsStorageService, AwsStorageResolver],
  exports: [AwsStorageService]
})
export class AwsStorageModule {}
