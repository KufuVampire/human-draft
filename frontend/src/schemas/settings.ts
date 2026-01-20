import z from 'zod';

export const updateProfileSchema = z.object({
	username: z.string().min(3).max(16).optional(),
	email: z.email().optional(),
	description: z.string().optional(),
});

export type TypeUpdateProfileSchema = z.infer<typeof updateProfileSchema>;
