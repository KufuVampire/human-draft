import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlogInput {
	@Field()
	title: string;

	@Field({ nullable: true })
	description?: string;

	@Field(() => [String])
	postIds: string[];
	
	@Field(() => [String])
	tags: string[]
}
