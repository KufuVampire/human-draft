import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { describe, expect, it, vi } from 'vitest';

import { AuthGuard } from './auth.guard';
import { UserService } from '../modules/user/user.service';

describe('AuthGuard', () => {
	const createMockContext = (session: Record<string, any> = {}) => {
		const req: Record<string, any> = { session };
		const ctx = {
			getContext: () => ({ req }),
		};

		vi.spyOn(GqlExecutionContext, 'create').mockReturnValue(ctx as any);

		return {
			req,
			context: {} as ExecutionContext,
		};
	};

	it('Выбрасывает UnauthorizedException при отсутствии userId в сессии', async () => {
		const mockUserService = {
			findById: vi.fn(),
		} as unknown as UserService;

		const guard = new AuthGuard(mockUserService);
		const { context } = createMockContext({});

		await expect(guard.canActivate(context)).rejects.toThrow(
			new UnauthorizedException('Unauthorized')
		);
	});

	it('Выбрасывает UnauthorizedException("User no longer exists"), если пользователь удалён из БД', async () => {
		const mockUserService = {
			findById: vi.fn().mockResolvedValue(null),
		} as unknown as UserService;

		const guard = new AuthGuard(mockUserService);
		const { context } = createMockContext({ userId: 'deleted-user-id' });

		await expect(guard.canActivate(context)).rejects.toThrow(
			new UnauthorizedException('User no longer exists')
		);
		expect(mockUserService.findById).toHaveBeenCalledWith('deleted-user-id');
	});

	it('Успешно авторизует пользователя и записывает req.user, если пользователь существует', async () => {
		const mockUser = { id: 'valid-user-id', username: 'testuser' };
		const mockUserService = {
			findById: vi.fn().mockResolvedValue(mockUser),
		} as unknown as UserService;

		const guard = new AuthGuard(mockUserService);
		const { context, req } = createMockContext({ userId: 'valid-user-id' });

		const result = await guard.canActivate(context);

		expect(result).toBe(true);
		expect(req.user).toEqual(mockUser);
	});
});
