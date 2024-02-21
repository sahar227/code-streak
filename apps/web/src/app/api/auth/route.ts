import { z } from "zod";
import { db } from "@/db";
import { githubProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import * as github from "@/api/github";

const codeSchema = z.object({ code: z.string() });

export async function POST(req: Request) {
  const body = await req.json();
  const code = codeSchema.parse(body).code;

  const accessToken = await github.getTokenFromCode(code);
  const githubUser = await github.getUser(accessToken);

  const existingUser = await db().query.users.findFirst({
    where: eq(users.authId, githubUser.id.toString()),
  });

  if (existingUser) {
    const authResponse = {
      userId: existingUser.id,
      githubAuthToken: accessToken,
    };
    const token = jwt.sign(authResponse, process.env.JWT_SECRET!);
    return Response.json({ token });
  }

  const email = await github.getEmail(accessToken);
  if (!email)
    return Response.json({ error: "No primary email found" }, { status: 400 });

  const user = (
    await db()
      .insert(users)
      .values({
        authId: githubUser.id.toString(),
        email: email,
        name: githubUser.login,
        userName: githubUser.login,
      })
      .returning({ id: users.id })
  ).at(0);

  if (!user)
    return Response.json({ error: "Failed to create user" }, { status: 500 });

  await db().insert(githubProfiles).values({
    githubUserId: githubUser.id.toString(),
    userId: user.id,
    reposUrl: githubUser.repos_url,
  });

  const authResponse = {
    userId: user.id,
    githubAuthToken: accessToken,
  };
  const token = jwt.sign(authResponse, process.env.JWT_SECRET!);
  return Response.json({ token });
}
