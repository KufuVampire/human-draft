import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { SearchParamsInput } from '@/src/inputs';
import { UserModel, UserPagination } from '@/src/models';
import { IGQLContext } from '@/src/types';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
	public constructor(private readonly userService: UserService) {}

	@Query(() => UserModel, { name: 'getUserByUsername' })
	public async getUserByUsername(@Args('username') username: string) {
		return this.userService.getUserByUsername(username);
	}

	@Query(() => UserPagination, { name: 'getAllUsersPagination' })
	async getAllUsers(
		@Args('searchParams', {
			nullable: true,
			defaultValue: { page: 1, perPage: 10 },
		})
		searchParams: SearchParamsInput,
		@Context() { req }: IGQLContext
	) {
		return this.userService.getAllUsers(searchParams, req.session.userId);
	}
}
