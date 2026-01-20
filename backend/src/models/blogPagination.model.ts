import { Field, Int, ObjectType } from '@nestjs/graphql';

import { BlogModel as Blog } from './blog.model';
import { BlogModel } from '../../prisma/generated/models';

@ObjectType()
export class BlogPagination {
	@Field(() => [Blog])
	data: BlogModel[];

	@Field(() => Int)
	totalCount: number;

	@Field(() => Int)
	page: number;

	@Field(() => Int)
	perPage: number;

	@Field(() => Int)
	totalPages: number;
}
