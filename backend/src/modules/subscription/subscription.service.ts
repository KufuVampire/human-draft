import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
	public constructor(private readonly prismaService: PrismaService) {}

	async subscribe(fromUserId: string, toUserId: string) {
		if (fromUserId === toUserId) {
			throw new BadRequestException('You cannot subscribe to yourself');
		}

		const isExists = await this.prismaService.subscription.findUnique({
			where: {
				fromUserId_toUserId: {
					fromUserId,
					toUserId,
				},
			},
		});

		if (isExists) {
			throw new BadRequestException('You are already subscribed to this user.');
		}

		await this.prismaService.subscription.create({
			data: {
				fromUserId,
				toUserId,
			},
		});

		return true;
	}

	async unsubscribe(fromUserId: string, toUserId: string) {
		const isSubscribed = await this.prismaService.subscription.findUnique({
			where: {
				fromUserId_toUserId: {
					fromUserId,
					toUserId,
				},
			},
		});

		if (!isSubscribed) {
			throw new NotFoundException('Subscription not found');
		}

		await this.prismaService.subscription.delete({
			where: {
				fromUserId_toUserId: {
					fromUserId,
					toUserId,
				},
			},
		});

		return true;
	}
}
