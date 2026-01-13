import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { UpdateUserModel } from './../../../types/updateUserModel';

import { Auth, Authorized } from '@/src/decorators';
import { SignInInput, SignUpInput, UpdateUserInput } from '@/src/inputs';
import { UserModel } from '@/src/models';
import { FileValidationPipe } from '@/src/pipes/fileValidation.pipe';
import { IGQLContext } from '@/src/types';
import { UserService } from '../../user/user.service';
import { AccountService } from './account.service';

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService, private readonly userService: UserService) {}

	@Mutation(() => UserModel, { name: 'signUp' })
	public async signUp(
		@Context() { req }: IGQLContext,
		@Args('data') input: SignUpInput
	) {
		return await this.accountService.signUp(req, input);
	}

	@Mutation(() => UserModel, { name: 'signIn' })
	public async signIn(
		@Context() { req }: IGQLContext,
		@Args('data') input: SignInInput
	) {
		return await this.accountService.signIn(req, input);
	}

	@Mutation(() => Boolean, { name: 'signOutAccount' })
	public async signOut(@Context() { req }: IGQLContext) {
		return await this.accountService.signOut(req);
	}

	@Auth()
	@Query(() => UserModel, { name: 'userProfile' })
	public profile(@Authorized() user: UserModel) {
		return this.accountService.profile(user);
	}

	@Auth()
	@Mutation(() => UserModel, { name: 'changeProfilePoster' })
	public async changePoster(
		@Authorized() user: UserModel,
		@Args('file', { type: () => GraphQLUpload }, FileValidationPipe)
		file: FileUpload
	) {
		return this.accountService.changePoster(user, file);
	}

	@Auth()
	@Mutation(() => UserModel, { name: 'removeProfilePoster' })
	public async removePoster(@Authorized() user: UserModel) {
		return this.accountService.removePoster(user);
	}

	@Auth()
	@Mutation(() => UserModel, { name: 'changeProfileAvatar' })
	public async changeAvatar(
		@Authorized() user: UserModel,
		@Args('file', { type: () => GraphQLUpload }, FileValidationPipe)
		file: FileUpload
	) {
		return this.accountService.changeAvatar(user, file);
	}

	@Auth()
	@Mutation(() => UserModel, { name: 'removeProfileAvatar' })
	public async removeAvatar(@Authorized() user: UserModel) {
		return this.accountService.removeAvatar(user);
	}

	@Auth()
	@Mutation(() => UserModel, {name: "updateUser"})
	public async updateUser(@Authorized('id') userId: string, @Args('data', { type: () => UpdateUserInput }) data: UpdateUserModel) {
		return this.userService.updateUser(userId, data);
	}
}
