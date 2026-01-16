import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { getGraphQLConfig } from '@/src/configs';
import {
	AccountModule,
	PrismaModule,
	RedisModule,
	SessionModule,
} from '@/src/modules';
import { IS_DEV_ENV } from '@/src/utils';
import { UserModule } from './modules/user/user.module';
import { AwsStorageModule } from './modules/aws-storage/aws-storage.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { TagModule } from './modules/tag/tag.module';
import { BlogModule } from './modules/blog/blog.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
	imports: [
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
})
export class AppModule {}
