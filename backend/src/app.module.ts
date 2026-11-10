import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';

import { getGraphQLConfig } from '@/src/configs';
import { GlobalGqlExceptionFilter } from '@/src/filters';
import { LoggingInterceptor } from '@/src/interceptors';
import {
	AccountModule,
	PrismaModule,
	RedisModule,
	SessionModule,
} from '@/src/modules';
import { IS_DEV_ENV } from '@/src/utils';
import { AwsStorageModule } from './modules/aws-storage/aws-storage.module';
import { BlogModule } from './modules/blog/blog.module';
import { CommentModule } from './modules/comment/comment.module';
import { PostModule } from './modules/post/post.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),
		PrismaModule,
		RedisModule,
		AccountModule,
		SessionModule,
		UserModule,
		AwsStorageModule,
		SubscriptionModule,
		TagModule,
		BlogModule,
		PostModule,
		CommentModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: GlobalGqlExceptionFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
	],
})
export class AppModule {}
