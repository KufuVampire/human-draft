import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreatePostInput {
	@Field()
	title: string;

	@Field(() => GraphQLJSON)
	content: any;

	@Field(() => [String])
	tags?: string[];
}
