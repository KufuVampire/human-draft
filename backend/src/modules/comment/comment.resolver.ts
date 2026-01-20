import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CommentService } from './comment.service';
import { Auth, Authorized } from '@/src/decorators';
import { CommentModel } from '@/src/models';

@Resolver('Comment')
export class CommentResolver {
	constructor(private readonly commentService: CommentService) {}

	@Auth()
	@Mutation(() => CommentModel, { name: 'createComment' })
	async create(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('text') text: string,
		@Args('parentId', { nullable: true }) parentId?: string
	) {
		return this.commentService.create(authorId, postId, text, parentId);
	}

	@Auth()
	@Mutation(() => CommentModel, { name: 'updateComment' })
	async update(
		@Authorized('id') authorId: string,
		@Args('commentId') commentId: string,
		@Args('text') text: string
	) {
		return this.commentService.update(authorId, commentId, text);
	}

	@Auth()
	@Mutation(() => CommentModel, { name: 'deleteComment' })
	async delete(
		@Authorized('id') authorId: string,
		@Args('commentId') commentId: string
	) {
		return this.commentService.delete(authorId, commentId);
	}
}
