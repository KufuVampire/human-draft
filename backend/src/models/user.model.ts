import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

import { BlogModel } from './blog.model';
import { CommentModel } from './comment.model';
import { PostModel } from './post.model';

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

	@Field(() => [BlogModel])
	blogs: BlogModel[];

	@Field(() => [PostModel])
	posts: PostModel[];

	@Field(() => [CommentModel])
	comments: CommentModel[];
}
