import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

import { AwsStorageService } from './aws-storage.service';
import { Auth, Authorized } from '@/src/decorators';
import { UploadImageModel } from '@/src/models';
import { FileValidationPipe } from '@/src/pipes/fileValidation.pipe';

@Resolver('aws')
export class AwsStorageResolver {
	constructor(private readonly storage: AwsStorageService) {}

	@Auth()
	@Mutation(() => UploadImageModel, { name: 'uploadImage' })
	public async uploadImage(
		@Authorized('id') authorId: string,
		@Args('image', { type: () => GraphQLUpload }, FileValidationPipe)
		img: FileUpload
	) {
		return this.storage.uploadForPost(img, authorId);
	}
}
