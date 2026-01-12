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
	],
})
export class AppModule {}
