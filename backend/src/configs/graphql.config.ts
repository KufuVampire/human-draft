import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { GraphQLFormattedError } from 'graphql';
import { join } from 'path';

import { isDev } from '../utils';

const SAFE_ERROR_CODES = new Set([
	'BAD_USER_INPUT',
	'GRAPHQL_VALIDATION_FAILED',
	'UNAUTHENTICATED',
	'FORBIDDEN',
	'NOT_FOUND',
	'CONFLICT',
]);

export function getGraphQLConfig(
	configService: ConfigService
): ApolloDriverConfig {
	const dev = isDev(configService);

	return {
		playground: dev,
		path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
		autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
		sortSchema: true,
		context: ({ req, res }) => ({ req, res }),
		formatError: (formattedError: GraphQLFormattedError) => {
			const code = formattedError.extensions?.code as string | undefined;

			if (!dev) {
				const isSafe = code && SAFE_ERROR_CODES.has(code);

				return {
					message: isSafe ? formattedError.message : 'Internal server error',
					extensions: {
						code: isSafe ? code : 'INTERNAL_SERVER_ERROR',
					},
					locations: formattedError.locations,
					path: formattedError.path,
				};
			}

			// In development, strip stacktrace/exception internals
			const cleanExtensions = {
				...((formattedError.extensions as Record<string, unknown>) ?? {}),
			};
			delete cleanExtensions.stacktrace;
			delete cleanExtensions.exception;
			delete cleanExtensions.originalError;

			return {
				...formattedError,
				extensions: cleanExtensions,
			};
		},
	};
}
