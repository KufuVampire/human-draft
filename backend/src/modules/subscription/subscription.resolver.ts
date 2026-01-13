import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SubscriptionService } from './subscription.service';
import { Auth, Authorized } from '@/src/decorators';

@Resolver('Subscription')
export class SubscriptionResolver {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@Auth()
	@Mutation(() => Boolean, { name: 'subscribeToUser' })
	public async subscribe(@Authorized('id') fromId: string, @Args('toId') toId: string) {
		return this.subscriptionService.subscribe(fromId, toId);
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'unsubscribeFromUser' })
	public async unsubscribe(@Authorized('id') fromId: string, @Args('toId') toId: string) {
		return this.subscriptionService.unsubscribe(fromId, toId);
	}
}
