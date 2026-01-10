import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';



import { UserService } from '../../user/user.service';



import { UserModel } from '@/prisma/generated/models';
import { SignInInput, SignUpInput } from '@/src/inputs';

































@Injectable()
export class SessionService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService
	) {}

	public async signIn(req: Request, input: SignInInput) {
		const { password, username } = input;

		const user = await this.userService.findByUsername(username);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const isValisPassword = await verify(user.password, password);

		if (!isValisPassword) {
			throw new UnauthorizedException('Password not valid');
		}

		return this.saveSession(req, user);
	}

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

	public async singOut(req: Request) {
		return this.destroySession(req);
	}

	public async saveSession(req: Request, user: UserModel) {
		return new Promise((resolve, reject) => {
			req.session.createAt = new Date().toISOString();
			req.session.userId = user.id;

			req.session.save((err) => {
				if (err) {
					console.error('Redis Save Error:', err);
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
