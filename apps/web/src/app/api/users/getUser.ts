import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserResponse } from "contracts";
const tokenContentSchema = z.object({
  userId: z.number(),
  githubAuthToken: z.string(),
});
const decriptJwt = (token: string) => {
  const tokenContent = jwt.verify(token, process.env.JWT_SECRET!) as unknown;
  return tokenContentSchema.parse(tokenContent);
};

export const getUser = async (
  token: string
): Promise<UserResponse | undefined> => {
  const tokenData = decriptJwt(token);
  const dbUser = await db().query.users.findFirst({
    where: eq(users.id, tokenData.userId),
    with: { userStatus: true },
  });

  if (!dbUser) return undefined;

  const user = {
    name: dbUser.name,
    currentStreak: dbUser.userStatus.currentStreak,
    longestStreak: dbUser.userStatus.longestStreak,
    xp: dbUser.userStatus.xp,
  } satisfies UserResponse;
  return user;
};
