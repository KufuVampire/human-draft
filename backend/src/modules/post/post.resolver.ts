import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { PostService } from './post.service';
import { Auth, Authorized } from '@/src/decorators';
import { CreatePostInput, UpdatePostInput } from '@/src/inputs';
import { PostModel } from '@/src/models';

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
	@Mutation(() => PostModel, { name: 'pinPost' })
	async pin(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('blogId') blogId: string
	) {
		return this.postService.pin(authorId, postId, blogId);
	}

	@Auth()
	@Mutation(() => PostModel, { name: 'unPinPost' })
	async unPin(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('blogId') blogId: string
	) {
		return this.postService.unPin(authorId, postId, blogId);
	}
}
