import { UserModel } from '@/prisma/generated/models';
import 'express-session';

declare module 'express-session' {
	interface SessionData {
		userId?: string;
		createdAt?: Date | string;
		user?: UserModel
	}
}
