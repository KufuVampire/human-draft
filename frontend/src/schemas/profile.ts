import z from 'zod';

export const userProfileSchema = z.object({
	id: z.string(),
	email: z.email(),
	username: z.string(),
	avatarUrl: z.string().optional(),
	confirmed: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	blocked: z.boolean(),
	role: {
		name: z.string(),
	}
});

export type TypeUserProfile = z.infer<typeof userProfileSchema>;
