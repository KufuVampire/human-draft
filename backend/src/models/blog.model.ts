import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';
import { PostModel } from './post.model';
import { TagModel } from './tag.model';

@ObjectType()
export class BlogModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

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
