import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { TagService } from './tag.service';
import { Auth } from '@/src/decorators';
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
}
