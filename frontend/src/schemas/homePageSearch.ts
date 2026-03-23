import z from 'zod';

export const HomePageSearchSchema = z.object({
	search: z.string(),
	onlyPosts: z.boolean(),
	onlyBlogs: z.boolean(),
	onlySubscriptions: z.boolean(),
});

export type TypeHomePageSearchSchema = z.infer<typeof HomePageSearchSchema>;
