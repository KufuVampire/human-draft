import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { TagService } from './tag.service';
import { Auth, Authorized } from '@/src/decorators';
import { UpdatePostOrBlogTagsInput } from '@/src/inputs';
import { BlogModel, PostModel, TagModel } from '@/src/models';

@Resolver(() => TagModel)
export class TagResolver {
	constructor(private readonly tagService: TagService) {}

	@ResolveField(() => [BlogModel], { name: 'blogs' })
	blogs(@Parent() tag: TagModel & { blogs?: BlogModel[] }) {
		return tag.blogs ?? [];
	}

	@ResolveField(() => [PostModel], { name: 'posts' })
	posts(@Parent() tag: TagModel & { posts?: PostModel[] }) {
		return tag.posts ?? [];
	}

	@Auth()
	@Mutation(() => TagModel, { name: 'createTag' })
	async create(@Args('name') name: string) {
		return this.tagService.create(name);
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'updatePostOrBlogTags' })
	async updatePostOrBlogTags(
		@Authorized('id') authorId: string,
		@Args('tags', { type: () => [String] }) tags: string[],
		@Args('to') to: UpdatePostOrBlogTagsInput
	) {
		return this.tagService.updateTags(authorId, tags, to);
	}

	@Query(() => [TagModel], { name: 'findTagsBySearchString' })
	async findTags(@Args('search') search: string) {
		return this.tagService.findTags(search);
	}
}
