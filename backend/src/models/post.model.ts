import { Field, GraphQLISODateTime, ID, ObjectType, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import { UserModel } from './user.model';
import { CommentModel } from './comment.model';
import { BlogModel } from './blog.model';
import { TagModel } from './tag.model';

@ObjectType()
export class PostModel {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

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

  @Field(() => [TagModel])
  tags: TagModel[];
}
