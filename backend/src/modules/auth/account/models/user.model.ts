import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
	@Field(() => ID)
	id: string;

	@Field()
	email: string;

	@Field()
	username: string;

	@Field(() => String, { nullable: true })
	description?: string | null;

	@Field(() => String, { nullable: true })
	avatarUrl?: string | null;

	@Field(() => String, { nullable: true })
	posterUrl?: string | null;

	@Field(() => GraphQLISODateTime)
	createdAt: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt: Date;
}
