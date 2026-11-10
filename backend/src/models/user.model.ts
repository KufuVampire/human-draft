import {
	Field,
	GraphQLISODateTime,
	ID,
	Int,
	ObjectType,
} from '@nestjs/graphql';

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

	@Field(() => [String])
	subscriptions: string[];

	@Field(() => [String])
	subscribers: string[];

	@Field(() => Int, { nullable: true })
	postsCount?: number;

	@Field(() => Int, { nullable: true })
	blogsCount?: number;

	@Field(() => Int, { nullable: true })
	subscribersCount?: number;

	@Field(() => Int, { nullable: true })
	subscriptionsCount?: number;
}
