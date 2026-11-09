import { ExecutionContext, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
	const interceptor = new LoggingInterceptor();

	const createMockContext = (
		parentType?: string,
		fieldName = 'testOperation'
	) => {
		const mockGqlContext = {
			getInfo: vi.fn().mockReturnValue(
				parentType
					? {
							parentType: { name: parentType },
							fieldName,
						}
					: null
			),
		};

		vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(
			mockGqlContext as any
		);

		return {} as ExecutionContext;
	};

	it('логирует успешное выполнение мутации с длительностью', async () => {
		const logSpy = vi
			.spyOn(Logger.prototype, 'log')
			.mockImplementation(() => {});
		const context = createMockContext('Mutation', 'createPost');
		const handler = {
			handle: () => of({ id: 'post-1' }),
		};

		const result$ = interceptor.intercept(context, handler as any);

		await new Promise<void>((resolve) => {
			result$.subscribe({
				next: () => {},
				complete: () => {
					expect(logSpy).toHaveBeenCalledWith(
						expect.stringMatching(/\[Mutation\] createPost executed in \d+ms/)
					);
					resolve();
				},
			});
		});

		logSpy.mockRestore();
	});

	it('логирует сбой мутации с сообщением об ошибке и длительностью', async () => {
		const errorSpy = vi
			.spyOn(Logger.prototype, 'error')
			.mockImplementation(() => {});
		const context = createMockContext('Mutation', 'deletePost');
		const handler = {
			handle: () => throwError(() => new Error('Post not found')),
		};

		const result$ = interceptor.intercept(context, handler as any);

		await new Promise<void>((resolve) => {
			result$.subscribe({
				error: (err) => {
					expect(err.message).toBe('Post not found');
					expect(errorSpy).toHaveBeenCalledWith(
						expect.stringMatching(
							/\[Mutation\] deletePost failed in \d+ms: Post not found/
						)
					);
					resolve();
				},
			});
		});

		errorSpy.mockRestore();
	});

	it('не логирует вложенные поля или контексты без info', async () => {
		const logSpy = vi
			.spyOn(Logger.prototype, 'log')
			.mockImplementation(() => {});
		const context = createMockContext(undefined);
		const handler = {
			handle: () => of('data'),
		};

		const result$ = interceptor.intercept(context, handler as any);

		await new Promise<void>((resolve) => {
			result$.subscribe({
				complete: () => {
					expect(logSpy).not.toHaveBeenCalled();
					resolve();
				},
			});
		});

		logSpy.mockRestore();
	});
});
