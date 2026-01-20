import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload-ts';

import { AppModule } from './app.module';
import { MAX_FILE_SIZE } from './consts';
import { RedisService } from './modules';
import { ms, StringValue } from './utils';
import { parseBoolean } from '@/src/utils';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);
	const redis = app.get(RedisService);

	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));
	app.use(
		graphqlUploadExpress({
			maxFileSize: MAX_FILE_SIZE,
		})
	);

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const maxAge = ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE'));

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge,
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax',
			},
			store: new RedisStore({
				client: redis.client,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
			}),
		})
	);

	app.enableCors({
		origin: (origin, callback) => {
			if (
				origin.endsWith('.vercel.app') &&
				origin.startsWith('https://human-draft')
			) {
				return callback(null, true);
			}

			if (origin === config.getOrThrow<string>('ALLOWED_ORIGIN')) {
				return callback(null, true);
			}

			return callback(new Error('Not allowed by CORS'), false);
		},
		credentials: true,
		exposedHeaders: ['set-cookie'],
	});

	await app.listen(config.getOrThrow<string>('APPLICATION_PORT') || 4001);
}
void bootstrap();
