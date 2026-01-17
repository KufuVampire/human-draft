import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PostService } from './post.service';
import { Auth, Authorized } from '@/src/decorators';
import {
	CreatePostInput,
	SearchParamsInput,
	UpdatePostInput,
} from '@/src/inputs';
import { PostModel, PostPagination } from '@/src/models';

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
	@Mutation(() => PostModel, { name: 'updatePost' })
	async update(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('data') input: UpdatePostInput
	) {
		return this.postService.update(authorId, postId, input);
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'deletePost' })
	async delete(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string
	) {
		return this.postService.delete(authorId, postId);
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
	@Mutation(() => PostModel, { name: 'unPinPostFromBlog' })
	async unPinPostFromBlog(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('blogId') blogId: string
	) {
		return this.postService.unPinPostFromBlog(authorId, postId, blogId);
	}

	@Query(() => PostPagination, { name: 'getAllPostsPagination' })
	async getAllPosts(@Args('searchParams') searchParams: SearchParamsInput) {
		return this.postService.getAllPosts(searchParams);
	}
}
