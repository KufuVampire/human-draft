import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { Request } from 'express';

import { UserService } from '../../user/user.service';
import { SessionService } from '../session/session.service';

import { PrismaService } from '@/src/modules/prisma/prisma.service';
import { SignInInput, SignUpInput } from '@/src/inputs';

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly sessionService: SessionService
	) {}

	public async findAll() {
		const users = await this.prismaService.user.findMany();

		if (!users || !users.length) return [];

		return users;
	}

	public async signUp(req: Request, input: SignUpInput) {
		const { email, password, username } = input;

		const isUserExists = await this.userService.findByFields([
			{ username },
			{ email },
		]);

		if (isUserExists) {
			throw new ConflictException('This email or username is already taken');
		}

		const newUser = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
			},
		});

		if (!newUser) {
			throw new UnprocessableEntityException('Unable to create account');
		}

		const userInSession = this.sessionService.signUp(req, newUser);

		return userInSession;
	}

	public async signIn(req: Request, input: SignInInput) {
		const { password, username } = input;

		const user = await this.userService.findByUsername(username);

		if (!user) {
			throw new NotFoundException('This username does not exist.');
		}

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Unable to sign in to your account');
		}

		const userInSession = await this.sessionService.saveSession(req, user);

		return userInSession;
	}
}
