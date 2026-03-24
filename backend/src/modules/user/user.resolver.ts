import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { UserService } from './user.service';
import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '@/src/consts';
import { SearchParamsInput } from '@/src/inputs';
import { UserModel, UserPagination } from '@/src/models';
import { IGQLContext } from '@/src/types';

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
			defaultValue: { page: PAGINATION_PAGE, perPage: PAGINATION_PER_PAGE },
		})
		searchParams: SearchParamsInput,
		@Args('onlySubscriptions', { type: () => Boolean })
		onlySubscriptions: boolean,
		@Args('searchStr', { nullable: true, defaultValue: '' }) searchStr?: string,
		@Context() context?: IGQLContext
	) {
		return this.userService.getAllUsers({
			onlySubscriptions,
			searchParams,
			searchStr,
			userId: context?.req.session.userId,
		});
	}
}
