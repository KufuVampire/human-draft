import z from 'zod';

export const SearchSchema = z.object({
	search: z.string(),
});

export type TypeSearchSchema = z.infer<typeof SearchSchema>;
