import z from "zod";

export const CreateCommentSchema = z.object({
	text: z.string()
});

export type TypeCreateCommentSchema = z.infer<typeof CreateCommentSchema>

export const UpdateCommentSchema = z.object({
	text: z.string()
});

export type TypeUpdateCommentSchema = z.infer<typeof UpdateCommentSchema>