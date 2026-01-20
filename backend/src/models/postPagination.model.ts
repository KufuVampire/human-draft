import { Field, Int, ObjectType } from '@nestjs/graphql';

import { PostModel as Post } from './post.model';
import { PostModel } from '../../prisma/generated/models';

@ObjectType()
export class PostPagination {
	@Field(() => [Post])
	data: PostModel[];

	@Field(() => Int)
	totalCount: number;

	@Field(() => Int)
	page: number;

	@Field(() => Int)
	perPage: number;

	@Field(() => Int)
	totalPages: number;
}
