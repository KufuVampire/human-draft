import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/prisma/generated/client';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(configService: ConfigService) {
		super({
			adapter: new PrismaPg({
				host: configService.getOrThrow<string>('DATABASE_HOST'),
				port: configService.getOrThrow<number>('DATABASE_PORT'),
				database: configService.getOrThrow<string>('DATABASE_NAME'),
				user: configService.getOrThrow<string>('DATABASE_USERNAME'),
				password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
				schema: 'public',
			}),
		});
	}
}
