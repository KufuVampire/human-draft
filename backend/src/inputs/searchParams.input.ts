import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchParamsInput {
	@Field(() => Int, { nullable: true })
	perPage?: number;
	
	@Field(() => Int, { nullable: true })
	page?: number;
}
