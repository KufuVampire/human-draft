import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { SignInInput, SignUpInput } from '@/src/inputs';
import { IGQLContext } from '@/src/types';

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'findAllUsers' })
	public async findAll() {
		return await this.accountService.findAll();
	}

	@Mutation(() => UserModel, { name: 'signUp' })
	public async signUp(
		@Context() { req }: IGQLContext,
		@Args('data') input: SignUpInput
	) {
		return await this.accountService.signUp(req, input);
	}

	@Query(() => UserModel, { name: 'signIn' })
	public async signIn(
		@Context() { req }: IGQLContext,
		@Args('data') input: SignInInput
	) {
		return await this.accountService.signIn(req, input);
	}
}
