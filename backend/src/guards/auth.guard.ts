import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserService } from './../modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req;

		const userId = req.session.userId;

		if (typeof userId === 'undefined') {
			throw new UnauthorizedException('Unauthorized');
		}

		const user = await this.userService.findById(userId);

		req.user = user;

		return true;
	}
}