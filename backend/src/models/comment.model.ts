import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';
import { PostModel } from './post.model';

@ObjectType()
export class CommentModel {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => UserModel)
  author: UserModel;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => [CommentModel])
  replies: CommentModel[];

  @Field(() => PostModel, { nullable: true })
  post?: PostModel | null;
}
