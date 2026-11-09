import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	HttpStatus,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { describe, expect, it, vi } from 'vitest';

import { GlobalGqlExceptionFilter } from './gqlException.filter';
import { Prisma } from '@/prisma/generated/client';

describe('GlobalGqlExceptionFilter', () => {
	const filter = new GlobalGqlExceptionFilter();

	const createMockHost = (fieldName = 'testField') => {
		const mockGqlHost = {
			getInfo: vi.fn().mockReturnValue({ fieldName }),
			getContext: vi.fn().mockReturnValue({}),
			getArgs: vi.fn().mockReturnValue({}),
			getRoot: vi.fn().mockReturnValue({}),
		};
		vi.spyOn(GqlArgumentsHost, 'create').mockReturnValue(mockGqlHost as any);
		return {} as any;
	};

	it('корректно обрабатывает NotFoundException', () => {
		const host = createMockHost('getUserByUsername');
		const exception = new NotFoundException('User not found');

		const result = filter.catch(exception, host);

		expect(result).toBeInstanceOf(GraphQLError);
		expect(result.message).toBe('User not found');
		expect(result.extensions.code).toBe('NOT_FOUND');
		expect(result.extensions.status).toBe(HttpStatus.NOT_FOUND);
	});

	it('корректно обрабатывает ConflictException', () => {
		const host = createMockHost('createUser');
		const exception = new ConflictException('Username taken');

		const result = filter.catch(exception, host);

		expect(result).toBeInstanceOf(GraphQLError);
		expect(result.message).toBe('Username taken');
		expect(result.extensions.code).toBe('CONFLICT');
		expect(result.extensions.status).toBe(HttpStatus.CONFLICT);
	});

	it('корректно обрабатывает BadRequestException со списком ошибок валидации', () => {
		const host = createMockHost('createPost');
		const exception = new BadRequestException({
			message: ['Title is too short', 'Content cannot be empty'],
			error: 'Bad Request',
			statusCode: 400,
		});

		const result = filter.catch(exception, host);

		expect(result).toBeInstanceOf(GraphQLError);
		expect(result.message).toBe('Title is too short, Content cannot be empty');
		expect(result.extensions.code).toBe('BAD_USER_INPUT');
	});

	it('корректно обрабатывает UnauthorizedException и ForbiddenException', () => {
		const host = createMockHost('secretQuery');

		const unauthResult = filter.catch(new UnauthorizedException(), host);
		expect(unauthResult.extensions.code).toBe('UNAUTHENTICATED');

		const forbidResult = filter.catch(
			new ForbiddenException('Access denied'),
			host
		);
		expect(forbidResult.extensions.code).toBe('FORBIDDEN');
		expect(forbidResult.message).toBe('Access denied');
	});

	it('маскирует Prisma P2002 (Unique constraint) без утечки схемы БД', () => {
		const host = createMockHost('updateUser');
		const prismaError = new Prisma.PrismaClientKnownRequestError(
			'Unique constraint failed on the fields: (`users_email_key`)',
			{ code: 'P2002', clientVersion: '7.x' }
		);

		const result = filter.catch(prismaError, host);

		expect(result).toBeInstanceOf(GraphQLError);
		expect(result.message).toBe('Record with this value already exists');
		expect(result.extensions.code).toBe('CONFLICT');
		expect(result.message).not.toContain('users_email_key');
	});

	it('обрабатывает Prisma P2025 (Record not found)', () => {
		const host = createMockHost('deletePost');
		const prismaError = new Prisma.PrismaClientKnownRequestError(
			'An operation failed because it depends on one or more records that were required but not found',
			{ code: 'P2025', clientVersion: '7.x' }
		);

		const result = filter.catch(prismaError, host);

		expect(result).toBeInstanceOf(GraphQLError);
		expect(result.message).toBe('Record not found');
		expect(result.extensions.code).toBe('NOT_FOUND');
	});

	it('обрабатывает Prisma P2003 (Foreign key constraint)', () => {
		const host = createMockHost('createComment');
		const prismaError = new Prisma.PrismaClientKnownRequestError(
			'Foreign key constraint failed on the field: `postId`',
			{ code: 'P2003', clientVersion: '7.x' }
		);

		const result = filter.catch(prismaError, host);

		expect(result).toBeInstanceOf(GraphQLError);
		expect(result.message).toBe('Related record not found');
		expect(result.extensions.code).toBe('BAD_USER_INPUT');
	});

	it('пропускает существующий GraphQLError', () => {
		const host = createMockHost('syntaxCheck');
		const gqlError = new GraphQLError('Syntax error in query', {
			extensions: { code: 'GRAPHQL_PARSE_FAILED' },
		});

		const result = filter.catch(gqlError, host);

		expect(result).toBe(gqlError);
	});

	it('маскирует непредвиденные системные ошибки в Internal server error', () => {
		const host = createMockHost('unexpectedFault');
		const sysError = new Error('Cannot read properties of undefined');

		const result = filter.catch(sysError, host);

		expect(result).toBeInstanceOf(GraphQLError);
		expect(result.message).toBe('Internal server error');
		expect(result.extensions.code).toBe('INTERNAL_SERVER_ERROR');
	});
});
