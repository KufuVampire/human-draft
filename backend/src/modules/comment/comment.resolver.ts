import {
	Args,
	Mutation,
	Parent,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

import { CommentService } from './comment.service';
import { CommentsLoader } from './dataloader/CommentsLoader';
import { Auth, Authorized } from '@/src/decorators';
import { CommentModel } from '@/src/models';

@Resolver(() => CommentModel)
export class CommentResolver {
	constructor(
		private readonly commentService: CommentService,
		private readonly commentsLoader: CommentsLoader
	) {}

	@Auth()
	@Mutation(() => Boolean, { name: 'createComment' })
	async create(
		@Authorized('id') authorId: string,
		@Args('postId') postId: string,
		@Args('text') text: string,
		@Args('parentId', { nullable: true }) parentId?: string
	) {
		return this.commentService.create(authorId, postId, text, parentId);
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'updateComment' })
	async update(
		@Authorized('id') authorId: string,
		@Args('commentId') commentId: string,
		@Args('text') text: string
	) {
		return this.commentService.update(authorId, commentId, text);
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'deleteComment' })
	async delete(
		@Authorized('id') authorId: string,
		@Args('commentId') commentId: string
	) {
		return this.commentService.delete(authorId, commentId);
	}

	@ResolveField(() => [CommentModel])
	async replies(@Parent() comment: CommentModel) {
		return await this.commentsLoader.batchReplies.load(comment.id);
	}
}
