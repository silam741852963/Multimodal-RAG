import { z } from "zod";

export const searchSchema = z.object({
    query: z.string().min(1, { message: "Text query is required" }),
    image: z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), {
            message: "File must be an image",
        }),
    limit: z.coerce
        .number()
        .int()
        .min(1, { message: "Limit must be at least 1" })
        .max(30, { message: "Limit cannot exceed 30" })
});

export type SearchSchema = z.infer<typeof searchSchema>;