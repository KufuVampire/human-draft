import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { BlogModel } from './blog.model';
import { PostModel } from './post.model';

@ObjectType()
export class TagModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => [BlogModel])
  blogs: BlogModel[];

  @Field(() => [PostModel])
  posts: PostModel[];
}
