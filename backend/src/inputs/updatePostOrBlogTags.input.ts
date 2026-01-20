import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePostOrBlogTagsInput {
	@Field({ nullable: true })
	postId?: string;

	@Field({ nullable: true })
	blogId?: string;
}
