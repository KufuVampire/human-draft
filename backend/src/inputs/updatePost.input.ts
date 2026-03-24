import { Field, InputType, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdatePostInput {
	@Field({nullable: true})
	title?: string;

	@Field(() => GraphQLJSON, {nullable: true})
	content?: any;

	@Field(() => [String], {nullable: true})
	tags?: string[];
	
	@Field(() => Int, { nullable: true })
	likesCount?: number
	
	@Field(() => Int, { nullable: true })
	viewsCount?: number
}
