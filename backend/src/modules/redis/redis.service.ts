import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
	public client: RedisClientType;

	constructor(readonly configService: ConfigService) {
		this.client = createClient({
			socket: {
				host: configService.getOrThrow('REDIS_HOST'),
				port: configService.getOrThrow<number>('REDIS_PORT'),
			},
			username: configService.getOrThrow('REDIS_USER'),
			password: configService.getOrThrow('REDIS_PASSWORD'),
		});

		this.client.on('connect', () => console.log('✅ Redis подключен'));
		this.client.on('error', (err) => console.error('❌ Redis ошибка:', err));
	}

	async onModuleInit() {
		await this.client.connect();
	}
}
