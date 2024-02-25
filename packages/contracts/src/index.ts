import * as z from "zod";
export const userResponseSchema = z.object({
  name: z.string(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  xp: z.number(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
