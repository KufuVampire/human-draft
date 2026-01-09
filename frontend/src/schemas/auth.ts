import { z } from 'zod';

export const createAccountSchema = z.object({
	email: z.email(),
	username: z.string().min(3).max(16),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
});

export type TypeCreateAccountSchema = z.infer<typeof createAccountSchema>;

export const signInAccountSchema = z.object({
	username: z.string().min(3).max(16),
	password: z.string().min(8),
});

export type TypeSignInAccount = z.infer<typeof signInAccountSchema>;

