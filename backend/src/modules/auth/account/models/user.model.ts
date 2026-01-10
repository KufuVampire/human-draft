import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class UserModel {
	@Field(() => ID)
	id: string;

	@Field()
	email: string;

	@Field()
	username: string;

	@Field(() => String, { nullable: true })
	avatarUrl?: string | null;

	@Field(() => GraphQLISODateTime)
	createdAt: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt: Date;
}
