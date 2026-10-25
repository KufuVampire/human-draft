import { Field, InputType } from '@nestjs/graphql';
import {
	ArrayMaxSize,
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';

@InputType()
export class UpdateBlogInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(150)
	title?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(500)
	description?: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	postIds?: string[];

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@ArrayMaxSize(10)
	@IsString({ each: true })
	tags?: string[];
}
