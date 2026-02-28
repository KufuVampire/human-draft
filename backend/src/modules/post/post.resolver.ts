import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PostService } from './post.service';
import { Auth, Authorized } from '@/src/decorators';
import {
	CreatePostInput,
	SearchParamsInput,
	UpdatePostInput,
} from '@/src/inputs';
import { PostDeleteResponse, PostModel, PostPagination, UnPinPostResponse } from '@/src/models';

@Resolver('Post')
export class PostResolver {
	constructor(private readonly postService: PostService) {}

	@Auth()
	@Mutation(() => PostModel, { name: 'createPost' })
	async create(
		@Authorized('id') authorId: string,
		@Args('data') input: CreatePostInput,
		@Args('blogId', { nullable: true }) blogId?: string
	) {
		return this.postService.create(authorId, input, blogId);
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'updatePost' })
	async update(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('data') input: UpdatePostInput
	) {
		return this.postService.update(authorId, postId, input);
	}

	@Auth()
	@Mutation(() => PostDeleteResponse, { name: 'deletePost' })
	async delete(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string
	) {
		await this.postService.delete(authorId, postId);
		return {postId}
	}

	@Auth()
	@Mutation(() => PostModel, { name: 'pinPostToBlog' })
	async pinPostToBlog(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('blogId') blogId: string
	) {
		return this.postService.pinPostToBlog(authorId, postId, blogId);
	}

	@Auth()
	@Mutation(() => UnPinPostResponse, { name: 'unPinPostFromBlog' })
	async unPinPostFromBlog(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('blogId') blogId: string
	) {
		await this.postService.unPinPostFromBlog(authorId, postId, blogId);

		return {
			postId,
		};
	}

	@Query(() => PostModel, { name: 'getPostById' })
	async getPostById(@Args('postId') postId: string) {
		return this.postService.getPostById(postId);
	}

	@Query(() => PostPagination, { name: 'getAllPostsPagination' })
	async getAllPosts(
		@Args('searchParams', {
			nullable: true,
			defaultValue: { page: 1, perPage: 10 },
		})
		searchParams: SearchParamsInput
	) {
		return this.postService.getAllPosts(searchParams);
	}

	@Auth()
	@Query(() => [PostModel], { name: 'getFreePostsForPin' })
	async getFreePostsForPin(
		@Authorized('id') userId: string,
		@Args('searchStr', { nullable: true }) searchStr?: string
	) {
		return this.postService.getAllFreeUserPostsForPin(userId, searchStr);
	}
}
