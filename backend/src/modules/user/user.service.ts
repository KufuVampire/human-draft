import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserModel } from '@/src/types';
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

		if (!user) {
			throw new NotFoundException(`User not found by ${username}`);
		}

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
		data: UpdateUserModel
	) {
		const updatedUser = await this.prismaService.user.update({
			where: {
				id,
			},
			data: {
				...data,
			},
		});

		return updatedUser;
	}

	public async getAllUsers() {
		return this.prismaService.user.findMany();
	}
}
