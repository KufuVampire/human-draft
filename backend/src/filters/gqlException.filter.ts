import {
	ArgumentsHost,
	Catch,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import { Prisma } from '@/prisma/generated/client';

const HTTP_STATUS_TO_GQL_CODE: Record<number, string> = {
	[HttpStatus.BAD_REQUEST]: 'BAD_USER_INPUT',
	[HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
	[HttpStatus.FORBIDDEN]: 'FORBIDDEN',
	[HttpStatus.NOT_FOUND]: 'NOT_FOUND',
	[HttpStatus.CONFLICT]: 'CONFLICT',
	[HttpStatus.UNPROCESSABLE_ENTITY]: 'BAD_USER_INPUT',
	[HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
};

@Catch()
export class GlobalGqlExceptionFilter implements GqlExceptionFilter {
	private readonly logger = new Logger(GlobalGqlExceptionFilter.name);

	public catch(exception: unknown, host: ArgumentsHost) {
		const gqlHost = GqlArgumentsHost.create(host);
		const info = gqlHost.getInfo();
		const fieldName = info?.fieldName ?? 'unknown';

		// 1. HttpException
		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const response = exception.getResponse();
			const code = HTTP_STATUS_TO_GQL_CODE[status] ?? 'INTERNAL_SERVER_ERROR';

			let message = exception.message;
			if (
				typeof response === 'object' &&
				response !== null &&
				'message' in response
			) {
				const resMsg = (response as { message: unknown }).message;
				if (Array.isArray(resMsg)) {
					message = resMsg.join(', ');
				} else if (typeof resMsg === 'string') {
					message = resMsg;
				}
			}

			if (status >= Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
				this.logger.error(
					`[GQL Error] Field "${fieldName}": ${message}`,
					exception.stack
				);
			} else {
				this.logger.warn(`[GQL Client Error] Field "${fieldName}": ${message}`);
			}

			return new GraphQLError(message, {
				extensions: {
					code,
					status,
				},
			});
		}

		// 2. Prisma Known Request Errors
		if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			let message = 'Database error occurred';
			let code = 'INTERNAL_SERVER_ERROR';
			let status = HttpStatus.INTERNAL_SERVER_ERROR;

			switch (exception.code) {
				case 'P2002':
					message = 'Record with this value already exists';
					code = 'CONFLICT';
					status = HttpStatus.CONFLICT;
					break;
				case 'P2025':
					message = 'Record not found';
					code = 'NOT_FOUND';
					status = HttpStatus.NOT_FOUND;
					break;
				case 'P2003':
					message = 'Related record not found';
					code = 'BAD_USER_INPUT';
					status = HttpStatus.BAD_REQUEST;
					break;
				default:
					message = 'Database error occurred';
					code = 'INTERNAL_SERVER_ERROR';
					status = HttpStatus.INTERNAL_SERVER_ERROR;
			}

			this.logger.error(
				`[Prisma Error ${exception.code}] Field "${fieldName}": ${exception.message}`,
				exception.stack
			);

			return new GraphQLError(message, {
				extensions: {
					code,
					status,
				},
			});
		}

		// 3. Existing GraphQLError
		if (exception instanceof GraphQLError) {
			this.logger.warn(
				`[GraphQLError] Field "${fieldName}": ${exception.message}`
			);
			return exception;
		}

		// 4. Unknown / generic System Error
		const errMessage =
			exception instanceof Error ? exception.message : 'Internal server error';
		const stack = exception instanceof Error ? exception.stack : undefined;

		this.logger.error(
			`[Unhandled Error] Field "${fieldName}": ${errMessage}`,
			stack
		);

		return new GraphQLError('Internal server error', {
			extensions: {
				code: 'INTERNAL_SERVER_ERROR',
				status: HttpStatus.INTERNAL_SERVER_ERROR,
			},
		});
	}
}
