import z from 'zod';

export const CreatePostSchema = z.object({
	title: z.string(),
});

export type TypeCreatePostSchema = z.infer<typeof CreatePostSchema>;
