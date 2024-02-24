import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";

const tokenContentSchema = z.object({
  userId: z.number(),
  githubAuthToken: z.string(),
});
const decriptJwt = (token: string) => {
  const tokenContent = jwt.verify(token, process.env.JWT_SECRET!) as unknown;
  return tokenContentSchema.parse(tokenContent);
};

export const getUser = async (token: string) => {
  const tokenData = decriptJwt(token);
  const user = await db().query.users.findFirst({
    where: eq(users.id, tokenData.userId),
  });
  return user;
};
