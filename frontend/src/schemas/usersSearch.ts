import z from 'zod';

export const UsersSearchSchema = z.object({
	search: z.string().min(2),
	onlySubscriptions: z.boolean(),
});

export type TypeUsersSearchSchema = z.infer<typeof UsersSearchSchema>;
