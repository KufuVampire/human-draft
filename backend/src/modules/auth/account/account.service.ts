import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
	UnprocessableEntityException,
	UnsupportedMediaTypeException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { Request } from 'express';
import { FileUpload } from 'graphql-upload-ts';
import * as sharp from 'sharp';

import { AwsStorageService } from '../../aws-storage/aws-storage.service';
import { UserService } from '../../user/user.service';
import { SessionService } from '../session/session.service';

import { SignInInput, SignUpInput } from '@/src/inputs';
import { UserModel } from '@/src/models';
import { PrismaService } from '@/src/modules/prisma/prisma.service';

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
		private readonly storageService: AwsStorageService
	) {}

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

		return this.sessionService.signUp(req, newUser);
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

		return this.sessionService.saveSession(req, user);
	}

	public async signOut(req: Request) {
		return this.sessionService.signOut(req);
	}

	public async profile(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
			include: {
				blogs: {
					include: {
						tags: true
					}
				},
				posts: {
					include: {
						tags: true
					}
				},
				subscribers: {
					select: {
						fromUserId: true,
						id: true,
					},
				},
				subscriptions: {
					select: {
						toUserId: true,
						id: true,
					},
				},
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}
		
		return {
			...user,
			posts: user.posts ?? [],
			blogs: user.blogs ?? [],
			subscribers: user.subscribers.map((s) => s.fromUserId),
			subscriptions: user.subscriptions.map((s) => s.toUserId),
		};
	}

	public async changePoster(user: UserModel, file: FileUpload) {
		if (user.posterUrl) {
			await this.storageService.remove(`users/${user.id}-poster.webp`);
		}

		if (!file) {
			throw new BadRequestException('The file was not transferred');
		}

		const chunks: Buffer[] = [];

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);

		const fileName = `users/${user.id}-poster.webp`;
		if (file.filename && file.filename.startsWith('.gif')) {
			throw new UnsupportedMediaTypeException('Unsupported file type');
		}

		const processesBuffer = await sharp(buffer)
			.resize(950, 250)
			.webp()
			.toBuffer();

		await this.storageService.uploadForProfile(processesBuffer, fileName, 'image/webp');

		const fileUrl = this.storageService.getFileUrl(fileName);
		return this.userService.updateUser(user.id, { posterUrl: fileUrl });
	}

	public async removePoster(user: UserModel) {
		if (!user.posterUrl) {
			return;
		}
		await this.storageService.remove(`users/${user.id}-poster.webp`);

		return await this.userService.updateUser(user.id, { posterUrl: null });
	}

	public async changeAvatar(user: UserModel, file: FileUpload) {
		if (user.avatarUrl) {
			await this.storageService.remove(`users/${user.id}-avatar.webp`);
		}

		if (!file) {
			throw new BadRequestException('The file was not transferred');
		}

		const chunks: Buffer[] = [];

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);

		const fileName = `users/${user.id}-avatar.webp`;
		if (file.filename && file.filename.startsWith('.gif')) {
			throw new UnsupportedMediaTypeException('Unsupported file type');
		}

		const processesBuffer = await sharp(buffer)
			.resize(170, 170)
			.webp()
			.toBuffer();

		await this.storageService.uploadForProfile(processesBuffer, fileName, 'image/webp');

		const fileUrl = this.storageService.getFileUrl(fileName);
		return this.userService.updateUser(user.id, { avatarUrl: fileUrl });
	}

	public async removeAvatar(user: UserModel) {
		if (!user.avatarUrl) {
			return;
		}
		await this.storageService.remove(`users/${user.id}-avatar.webp`);

		return await this.userService.updateUser(user.id, { avatarUrl: null });
	}
}
