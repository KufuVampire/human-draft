import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { UserModel, UserPagination } from '@/src/models';

@Resolver('User')
export class UserResolver {
	public constructor(private readonly userService: UserService) {}

	@Query(() => UserModel, { name: 'getUserByUsername' })
	public async getUserByUsername(@Args('username') username: string) {
		return this.userService.getUserByUsername(username);
	}

	@Query(() => UserPagination, { name: 'getAllUsersPagination' })
	async getAllUsers(
		@Args('page', { type: () => Int, nullable: true }) page = 1,
		@Args('perPage', { type: () => Int, nullable: true }) perPage = 10
	) {
		return this.userService.getAllUsers({ page, perPage });
	}
}
