import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';

@ObjectType()
export class SubscriptionModel {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => UserModel)
  fromUser: UserModel;

  @Field(() => UserModel)
  toUser: UserModel;
}
