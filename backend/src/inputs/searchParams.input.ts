import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class SearchParamsInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	perPage?: number;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number;
}
