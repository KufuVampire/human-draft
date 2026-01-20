import { Field, Int, ObjectType } from '@nestjs/graphql';

import { UserModel as User } from './user.model';
import { UserModel } from '../../prisma/generated/models';

@ObjectType()
export class UserPagination {
	@Field(() => [User])
	data: UserModel[];

	@Field(() => Int)
	totalCount: number;

	@Field(() => Int)
	page: number;

	@Field(() => Int)
	perPage: number;

	@Field(() => Int)
	totalPages: number;
}
