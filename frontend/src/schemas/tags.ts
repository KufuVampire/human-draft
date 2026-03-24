import z from 'zod';

export const SearchTagsSchema = z.object({
	search: z.string().min(2),
});

export type TypeSearchTagsSchema = z.infer<typeof SearchTagsSchema>;
