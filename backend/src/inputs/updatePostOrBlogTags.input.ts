import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdatePostOrBlogTagsInput {
	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	postId?: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	blogId?: string;
}
