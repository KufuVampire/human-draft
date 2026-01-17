import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { BlogService } from './blog.service';
import { Auth, Authorized } from '@/src/decorators';
import {
	CreateBlogInput,
	SearchParamsInput,
	UpdateBlogInput,
} from '@/src/inputs';
import { BlogModel, BlogPagination } from '@/src/models';

@Resolver('Blog')
export class BlogResolver {
	constructor(private readonly blogService: BlogService) {}

	@Auth()
	@Mutation(() => BlogModel, { name: 'createBlog' })
	async createBlog(
		@Authorized('id') authorId: string,
		@Args('data') input: CreateBlogInput
	) {
		return this.blogService.create(authorId, input);
	}

	@Auth()
	@Mutation(() => BlogModel, { name: 'updateBlog' })
	async updateBlog(
		@Authorized('id') authorId: string,
		@Args('blogId') blogId: string,
		@Args('data') input: UpdateBlogInput
	) {
		return this.blogService.update(authorId, blogId, input);
	}

	@Auth()
	@Mutation(() => BlogModel, { name: 'deleteBlog' })
	async deleteBlog(
		@Authorized('id') authorId: string,
		@Args('blogId') blogId: string
	) {
		return this.blogService.delete(authorId, blogId);
	}

	@Auth()
	@Mutation(() => BlogModel, { name: 'pinPostToBlog' })
	async pinPostsToBlog(
		@Authorized('id') authorId: string,
		@Args('blogId') blogId: string,
		@Args('postIds', { type: () => [String] }) postIds: string[]
	) {
		return this.blogService.pinPostsToBlog(authorId, blogId, postIds);
	}
	@Auth()
	@Mutation(() => BlogModel, { name: 'unPinPostFromBlog' })
	async unPinPostsFromBlog(
		@Authorized('id') authorId: string,
		@Args('blogId') blogId: string,
		@Args('postIds', { type: () => [String] }) postIds: string[]
	) {
		return this.blogService.unPinPostsFromBlog(authorId, blogId, postIds);
	}

	@Query(() => BlogPagination, { name: 'getAllBlogsPagination' })
	async getAllBlogs(@Args('searchParams') searchParams: SearchParamsInput) {
		return this.blogService.getAllBlogs(searchParams);
	}
}
