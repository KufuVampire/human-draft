import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlogInput {
	@Field(() => String)
	title: string;

	@Field(() => String)
	description: string;

	@Field(() => String, { nullable: true })
	posterUrl?: string | null;

	@Field(() => [ID])
  postIds: string[];
}
