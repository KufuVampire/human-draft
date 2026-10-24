import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import { UserService } from '../../user/user.service';

import { SignUpInput } from '@/src/inputs';

@Injectable()
export class SessionService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService
	) {}

	public async signUp(req: Request, input: SignUpInput) {
		const { email, username } = input;

		const user = await this.userService.findByFields([
			{
				username,
			},
			{ email },
		]);

		if (!user) {
			throw new NotFoundException(
				`User not found with ${username} or ${email}`
			);
		}

		return this.saveSession(req, user);
	}

	public async signOut(req: Request) {
		return this.destroySession(req);
	}

	public async saveSession<T extends { id: string }>(
		req: Request,
		user: T
	): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			req.session.createdAt = new Date().toISOString();
			req.session.userId = user.id;

			req.session.save((err) => {
				if (err) {
					return reject(
						new InternalServerErrorException('Unable to save session')
					);
				}

				resolve(user);
			});
		});
	}

	public async destroySession(req: Request) {
		return new Promise((resolve, reject) => {
			req.session.destroy((err) => {
				if (err) {
					return reject(
						new InternalServerErrorException('Unable to complete session')
					);
				}
				req.res?.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				);
				resolve(true);
			});
		});
	}
}
