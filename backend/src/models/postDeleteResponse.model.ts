import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostDeleteResponse {
	@Field()
	postId: string;
}
