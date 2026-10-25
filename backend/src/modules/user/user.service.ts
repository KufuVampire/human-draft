import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { Prisma } from '@/prisma/generated/client';
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
			include: {
				blogs: {
					include: {
						author: true,
						tags: true,
					},
				},
				posts: {
					include: {
						author: true,
						tags: true,
					},
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
			throw new NotFoundException(`User not found by ${username}`);
		}

		return {
			...user,
			posts: user.posts ?? [],
			blogs: user.blogs ?? [],
			subscribers: user.subscribers.map((s) => s.fromUserId),
			subscriptions: user.subscriptions.map((s) => s.toUserId),
		};
	}

	public async findForAuth(username: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				username,
			},
			select: {
				id: true,
				username: true,
				email: true,
				password: true,
				description: true,
				avatarUrl: true,
				posterUrl: true,
				createdAt: true,
				updatedAt: true,
				subscribers: {
					select: {
						fromUserId: true,
					},
				},
				subscriptions: {
					select: {
						toUserId: true,
					},
				},
			},
		});

		if (!user) {
			return null;
		}

		return {
			...user,
			subscribers: user.subscribers.map((s) => s.fromUserId),
			subscriptions: user.subscriptions.map((s) => s.toUserId),
			blogs: [],
			posts: [],
		};
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
			include: {
				blogs: {
					include: {
						posts: true,
					},
				},
				posts: true,
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
		try {
			const updatedUser = await this.prismaService.user.update({
				where: {
					id,
				},
				data: {
					...data,
				},
			});

			return updatedUser;
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002'
			) {
				throw new ConflictException('Username or email is already taken');
			}
			throw error;
		}
	}

	public async getAllUsers(params: {
		searchParams: SearchParamsInput;
		searchStr?: string;
		onlySubscriptions?: boolean;
		userId?: string;
	}) {
		const { searchParams, onlySubscriptions, searchStr, userId } = params;

		const { page = PAGINATION_PAGE, perPage = PAGINATION_PER_PAGE } =
			searchParams;

		const skip = (page - 1) * perPage;

		const where: Prisma.UserWhereInput = {
			...(userId && { id: { not: userId } }),
			...(searchStr && {
				username: {
					contains: searchStr,
					mode: 'insensitive',
				},
			}),
			...(onlySubscriptions &&
				userId && {
					subscribers: {
						some: {
							fromUserId: userId,
						},
					},
				}),
		};

		const [users, totalCount] = await this.prismaService.$transaction([
			this.prismaService.user.findMany({
				take: perPage,
				skip,
				where,
				orderBy: { username: 'asc' },
			}),
			this.prismaService.user.count({ where }),
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
