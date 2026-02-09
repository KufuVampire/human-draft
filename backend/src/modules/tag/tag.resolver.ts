import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TagService } from './tag.service';
import { Auth } from '@/src/decorators';
import { UpdatePostOrBlogTagsInput } from '@/src/inputs';
import { TagModel } from '@/src/models';

@Resolver('Tag')
export class TagResolver {
	constructor(private readonly tagService: TagService) {}

	@Auth()
	@Mutation(() => TagModel, { name: 'createTag' })
	async create(@Args('name') name: string) {
		return this.tagService.create(name);
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'deleteTag' })
	async delete(@Args('name') name: string) {
		return this.tagService.delete(name);
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'updatePostOrBlogTags' })
	async updatePostOrBlogTags(
		@Args('tags', { type: () => [String] }) tags: string[],
		@Args('to') to: UpdatePostOrBlogTagsInput
	) {
		return this.tagService.updateTags(tags, to);
	}

	@Query(() => [TagModel], { name: 'findTagsBySearchString' })
	async findTags(@Args('search') search: string) {
		return this.tagService.findTags(search);
	}
}
