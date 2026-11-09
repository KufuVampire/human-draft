import {
	Args,
	Context,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

import { UserService } from './user.service';
import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '@/src/consts';
import { SearchParamsInput } from '@/src/inputs';
import {
	BlogModel,
	BlogPagination,
	PostModel,
	PostPagination,
	UserModel,
	UserPagination,
} from '@/src/models';
import { IGQLContext } from '@/src/types';

@Resolver(() => UserModel)
export class UserResolver {
	public constructor(private readonly userService: UserService) {}

	@Query(() => UserModel, { name: 'getUserByUsername' })
	public async getUserByUsername(@Args('username') username: string) {
		return this.userService.getUserByUsername(username);
	}

	@ResolveField(() => [PostModel], { name: 'posts' })
	public async posts(@Parent() user: UserModel) {
		if (user.postsCount === 0) {
			return [];
		}
		if (user.posts && user.posts.length > 0) {
			return user.posts;
		}
		return this.userService.getUserPosts(user.id);
	}

	@ResolveField(() => [BlogModel], { name: 'blogs' })
	public async blogs(@Parent() user: UserModel) {
		if (user.blogsCount === 0) {
			return [];
		}
		if (user.blogs && user.blogs.length > 0) {
			return user.blogs;
		}
		return this.userService.getUserBlogs(user.id);
	}

	@Query(() => PostPagination, { name: 'getUserPostsPagination' })
	public async getUserPostsPagination(
		@Args('username') username: string,
		@Args('searchParams', {
			nullable: true,
			defaultValue: { page: PAGINATION_PAGE, perPage: PAGINATION_PER_PAGE },
		})
		searchParams: SearchParamsInput
	) {
		return this.userService.getUserPostsPagination(username, searchParams);
	}

	@Query(() => BlogPagination, { name: 'getUserBlogsPagination' })
	public async getUserBlogsPagination(
		@Args('username') username: string,
		@Args('searchParams', {
			nullable: true,
			defaultValue: { page: PAGINATION_PAGE, perPage: PAGINATION_PER_PAGE },
		})
		searchParams: SearchParamsInput
	) {
		return this.userService.getUserBlogsPagination(username, searchParams);
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
