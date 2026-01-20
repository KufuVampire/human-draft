import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

import { PostModel } from './post.model';
import { TagModel } from './tag.model';
import { UserModel } from './user.model';

@ObjectType()
export class BlogModel {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	title: string;

	@Field(() => String)
	description: string;

	@Field(() => String, { nullable: true })
	posterUrl?: string | null;

	@Field(() => GraphQLISODateTime)
	createdAt: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt: Date;

	@Field(() => UserModel)
	author: UserModel;

	@Field(() => [PostModel])
	posts: PostModel[];

	@Field(() => [TagModel])
	tags: TagModel[];
}
