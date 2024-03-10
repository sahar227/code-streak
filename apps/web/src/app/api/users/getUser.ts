import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserResponse } from "contracts";
import { syncCommits } from "@/features/syncCommits";
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
    with: { userStatus: true, githubProfile: true },
  });

  if (!dbUser) return undefined;

  const updatedStatus = await syncCommits(
    tokenData.githubAuthToken,
    dbUser.githubProfile,
    dbUser.userStatus
  );

  const user = {
    name: dbUser.name,
    currentStreak: updatedStatus.currentStreak,
    longestStreak: updatedStatus.longestStreak,
    xp: updatedStatus.xp,
  } satisfies UserResponse;
  return user;
};
