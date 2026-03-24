import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadImageModel {
	@Field()
	url: string;
}
