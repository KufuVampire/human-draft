import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class SubscriptionIdModel {
	@Field(() => ID)
	id: string;
}
