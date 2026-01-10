import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1, "Page must be at least 1"),
  limit: z
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100"),
});

export const idSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type IdInput = z.infer<typeof idSchema>;
