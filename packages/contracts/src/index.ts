import * as z from "zod";
export const userResponseSchema = z.object({
  name: z.string(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
