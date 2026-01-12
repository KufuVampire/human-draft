import { Args, Query, Resolver } from '@nestjs/graphql';

import { UserModel } from '../auth/account/models/user.model';

import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
	public constructor(private readonly userService: UserService) {}

	@Query(() => UserModel, { name: 'getUserByUsername' })
	public async getUserByUsername(@Args('username') username: string) {
		return this.userService.getUserByUsername(username);
	}
}
