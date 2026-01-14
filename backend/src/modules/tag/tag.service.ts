import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
	constructor(private readonly prismaService: PrismaService) {}

	async findByName(name: string) {
		return this.prismaService.tag.findUnique({
			where: {
				name
			}
		})
	}

	async create(name: string) {
		const isExists = await this.findByName(name);

		if (isExists) {
			throw new ConflictException('Tag is already exists')
		}

		const tag = await this.prismaService.tag.create({
			data: {
				name
			}
		})

		return tag;
	}

	async delete(name: string) {
		const isExists = await this.findByName(name);

		if (!isExists) {
			throw new NotFoundException('Tag was not found')
		}

		await this.prismaService.tag.delete({
			where: {
				name
			}
		})

		return true;
	}
}
