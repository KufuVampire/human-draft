import { Field, InputType } from '@nestjs/graphql';
import {
	ArrayMaxSize,
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

import { Prisma } from '@/prisma/generated/client';

@InputType()
export class UpdatePostInput {
	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(150)
	title?: string;

	@Field(() => GraphQLJSON, { nullable: true })
	@IsOptional()
	@IsNotEmpty()
	content?: Prisma.InputJsonValue;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@ArrayMaxSize(10)
	@IsString({ each: true })
	tags?: string[];
}
