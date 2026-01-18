import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { env } from 'prisma/config';

import { PrismaClient } from '@/prisma/generated/client';

const adapter = new PrismaPg({
	host: env('DATABASE_HOST'),
	port: env('DATABASE_PORT'),
	database: env('DATABASE_NAME'),
	user: env('DATABASE_USERNAME'),
	password: env('DATABASE_PASSWORD'),
	schema: 'public',
});

const prisma = new PrismaClient({
	adapter,
});

async function main() {
	for (let i = 1; i <= 10; i++) {
		const isExists = await prisma.user.findUnique({
			where: {
				username: `user${i}`
			}
		})

		if (isExists) {
			continue;
		}

		await prisma.user.create({
			data: {
				email: `user${i}@test.ru`,
				username: `user${i}`,
				password: '12345678',
			},
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
