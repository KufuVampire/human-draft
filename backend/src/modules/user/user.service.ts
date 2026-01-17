import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '@/src/consts';
import { SearchParamsInput } from '@/src/inputs';
import { UpdateUserModel } from '@/src/types';

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

	public async updateUser(id: string, data: UpdateUserModel) {
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

	public async getAllUsers(searchParams: SearchParamsInput) {
		const { page = PAGINATION_PAGE, perPage = PAGINATION_PER_PAGE } =
			searchParams;

		const skip = (page - 1) * perPage;

		const [users, totalCount] = await this.prismaService.$transaction([
			this.prismaService.user.findMany({
				take: perPage,
				skip,
				orderBy: { id: 'asc' },
			}),
			this.prismaService.user.count(),
		]);

		return {
			data: users,
			totalCount,
			page,
			perPage,
			totalPages: Math.ceil(totalCount / perPage),
		};
	}
}
