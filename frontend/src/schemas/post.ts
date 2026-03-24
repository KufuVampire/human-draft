import z from 'zod';

export const CreatePostSchema = z.object({
	title: z.string(),
	search: z.string(),
});

export type TypeCreatePostSchema = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z.object({
	title: z.string(),
	search: z.string(),
});

export type TypeUpdatePostSchema = z.infer<typeof UpdatePostSchema>;
