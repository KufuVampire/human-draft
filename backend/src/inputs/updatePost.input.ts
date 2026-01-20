import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class UpdatePostInput {
	@Field(() => GraphQLJSON)
	content: any
}