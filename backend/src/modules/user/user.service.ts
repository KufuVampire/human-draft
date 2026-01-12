import { Injectable, NotFoundException } from '@nestjs/common';

import { UserModel } from '../auth/account/models/user.model';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findByUsername(username: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				username,
			},
		});

		return user;
	}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		});

		return user;
	}

	public async findByFields(fields: Record<string, string>[]) {
		const user = await this.prismaService.user.findFirst({
			where: {
				OR: fields,
			},
		});

		return user;
	}

	public async getUserByUsername(username: string) {
		const user = await this.findByUsername(username);

		if (!user) {
			throw new NotFoundException(`User with ${username} not found`);
		}

		return user;
	}

	public async updateUser(
		id: string,
		fieldName: keyof UserModel,
		fieldValue: string | null
	) {
		const updatedUser = await this.prismaService.user.update({
			where: {
				id,
			},
			data: {
				[fieldName]: fieldValue,
			},
		});

		return updatedUser;
	}
}
