import { describe, expect, it } from 'vitest';

import { isNotFoundError } from './isNotFoundError';

describe('isNotFoundError', () => {
	it('возвращает false для null и undefined', () => {
		expect(isNotFoundError(null)).toBe(false);
		expect(isNotFoundError(undefined)).toBe(false);
	});

	it('возвращает true для GraphQL ошибки со статусом 404', () => {
		const err = {
			graphQLErrors: [
				{
					message: 'Post was not found',
					extensions: {
						status: 404,
						originalError: {
							statusCode: 404,
							message: 'Post was not found',
						},
					},
				},
			],
		};
		expect(isNotFoundError(err)).toBe(true);
	});

	it('возвращает true для GraphQL ошибки с code NOT_FOUND', () => {
		const err = {
			graphQLErrors: [
				{
					message: 'Entity not found',
					extensions: {
						code: 'NOT_FOUND',
					},
				},
			],
		};
		expect(isNotFoundError(err)).toBe(true);
	});

	it('возвращает true для сетевой ошибки шлюза со статусом 404', () => {
		const err = {
			networkError: {
				statusCode: 404,
			},
		};
		expect(isNotFoundError(err)).toBe(true);
	});

	it('возвращает false для сетевой ошибки бэкенда (500)', () => {
		const err = {
			networkError: {
				statusCode: 500,
			},
			message: 'Failed to fetch',
		};
		expect(isNotFoundError(err)).toBe(false);
	});

	it('возвращает false для серверной ошибки GraphQL (500)', () => {
		const err = {
			graphQLErrors: [
				{
					message: 'Database query failed',
					extensions: {
						status: 500,
						code: 'INTERNAL_SERVER_ERROR',
					},
				},
			],
		};
		expect(isNotFoundError(err)).toBe(false);
	});

	it('не считает ошибку 404 по случайному вхождению подстроки в системную ошибку', () => {
		const dbErr = {
			graphQLErrors: [
				{
					message: 'Foreign key not found in table users',
					extensions: {
						status: 500,
						code: 'INTERNAL_SERVER_ERROR',
					},
				},
			],
		};
		expect(isNotFoundError(dbErr)).toBe(false);
	});

	it('возвращает true для обычного объекта с statusCode: 404', () => {
		expect(isNotFoundError({ statusCode: 404 })).toBe(true);
		expect(isNotFoundError({ status: 404 })).toBe(true);
	});
});
