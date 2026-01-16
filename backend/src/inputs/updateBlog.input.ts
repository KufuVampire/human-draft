import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogInput {
	@Field(() => String, { nullable: true })
	title?: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String, { nullable: true })
	posterUrl?: string;
}
