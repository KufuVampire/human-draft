import {
	Field,
	GraphQLISODateTime,
	ID,
	Int,
	ObjectType,
} from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import { BlogModel } from './blog.model';
import { CommentModel } from './comment.model';
import { TagModel } from './tag.model';
import { UserModel } from './user.model';

@ObjectType()
export class PostModel {
	@Field(() => ID)
	id: string;

	@Field(() => GraphQLISODateTime)
	createdAt: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt: Date;

	@Field()
	title: string

	@Field(() => GraphQLJSON)
	content: any;

	@Field(() => Int)
	likesCount: number;

	@Field(() => Int)
	viewsCount: number;

	@Field(() => Int)
	commentsCount: number;

	@Field(() => UserModel)
	author: UserModel;

	@Field(() => BlogModel, { nullable: true })
	blog?: BlogModel | null;

	@Field(() => [CommentModel])
	comments: CommentModel[];

	@Field(() => [TagModel], { nullable: true })
	tags?: TagModel[];
}
