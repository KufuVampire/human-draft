import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

import { BlogService } from './blog.service';
import { Auth, Authorized } from '@/src/decorators';
import {
	CreateBlogInput,
	SearchParamsInput,
	UpdateBlogInput,
} from '@/src/inputs';
import { BlogModel, BlogPagination, PostModel, UnPinPostResponse } from '@/src/models';
import { FileValidationPipe } from '@/src/pipes/fileValidation.pipe';

@Resolver('Blog')
export class BlogResolver {
	constructor(private readonly blogService: BlogService) {}

	@Auth()
	@Mutation(() => BlogModel, { name: 'createBlog' })
	async createBlog(
		@Authorized('id') authorId: string,
		@Args('data') input: CreateBlogInput,
		@Args(
			'poster',
			{ type: () => GraphQLUpload, nullable: true },
			FileValidationPipe
		)
		posterFile?: FileUpload
	) {
		return this.blogService.create(authorId, input, posterFile);
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
	@Mutation(() => Boolean, { name: 'deleteBlog' })
	async deleteBlog(
		@Authorized('id') authorId: string,
		@Args('blogId') blogId: string
	) {
		return this.blogService.delete(authorId, blogId);
	}

	@Auth()
	@Mutation(() => PostModel, { name: 'pinPost' })
	async pinPostToBlog(
		@Authorized('id') authorId: string,
		@Args('blogId') blogId: string,
		@Args('postId') postId: string
	) {
		return this.blogService.pinPostToBlog(authorId, blogId, postId);
	}

	@Auth()
	@Mutation(() => UnPinPostResponse, { name: 'unPinPost' })
	async unPinPostFromBlog(
		@Authorized('id') authorId: string,
		@Args('blogId') blogId: string,
		@Args('postId') postId: string
	) {
		await this.blogService.unPinPostFromBlog(authorId, blogId, postId);

		return {
			postId
		}
	}

	@Query(() => BlogPagination, { name: 'getAllBlogsPagination' })
	async getAllBlogs(
		@Args('searchParams', {
			nullable: true,
			defaultValue: { page: 1, perPage: 10 },
		})
		searchParams: SearchParamsInput
	) {
		return this.blogService.getAllBlogs(searchParams);
	}

	@Query(() => BlogModel, { name: 'getBlogById' })
	async getBlog(@Args('blogId') blogId: string) {
		return this.blogService.getBlog(blogId);
	}

	@Auth()
	@Query(() => [BlogModel], {name: "blogsForPin"})
	async blogsForPin(@Authorized('id') userId: string) {
		return this.blogService.blogsForPin(userId)
	}
}
