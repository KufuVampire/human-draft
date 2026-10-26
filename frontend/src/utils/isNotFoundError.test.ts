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

	it('возвращает false для сетевой ошибки бэкенда', () => {
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

	it('возвращает true для ошибки со словом "not found" или "не найден"', () => {
		expect(isNotFoundError(new Error('Post was not found'))).toBe(true);
		expect(isNotFoundError(new Error('Пост не найден'))).toBe(true);
	});
});
