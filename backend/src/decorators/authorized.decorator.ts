import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserModel } from '@/prisma/generated/models';

export const Authorized = createParamDecorator(
	(data: keyof UserModel, ctx: ExecutionContext) => {
		let user: UserModel;

		if (ctx.getType() === 'http') {
			user = ctx.switchToHttp().getRequest().user;
		} else {
			const context = GqlExecutionContext.create(ctx);
			user = context.getContext().req.user;
		}

		return data ? user[data] : user;
	}
);
