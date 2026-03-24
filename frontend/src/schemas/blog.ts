import z from 'zod';

export const createBlogSchema = z.object({
	title: z.string().min(3),
	description: z.string().optional(),
	postSearchStr: z.string().optional()
});

export type TypeCreateBlogSchema = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = z.object({
	title: z.string().min(3),
	description: z.string().optional(),
	postSearchStr: z.string().optional()
});

export type TypeUpdateBlogSchema = z.infer<typeof updateBlogSchema>;