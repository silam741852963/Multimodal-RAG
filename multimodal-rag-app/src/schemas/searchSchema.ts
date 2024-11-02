"use client"

import { z } from "zod";

export const searchSchema = z.object({
    query: z.string().min(1, { message: "Text query is required" }),
    image: z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), {
            message: "File must be an image",
        }),
});

export type SearchSchema = z.infer<typeof searchSchema>;
