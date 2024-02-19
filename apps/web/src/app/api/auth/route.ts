import { githubAPi } from "@/api";
import { z } from "zod";
import { GitHubEmail, GitHubUser } from "./githubTypes";
import { db } from "@/db";
import { githubProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const codeSchema = z.object({ code: z.string() });

const cliendId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_SECRET;

export async function POST(req: Request) {
  const body = await req.json();
  const code = codeSchema.parse(body).code;

  const {
    data: { access_token },
  } = await githubAPi.post<{ access_token: string }>(
    "login/oauth/access_token",
    {
      client_id: cliendId,
      client_secret: clientSecret,
      code,
    }
  );

  const { data: githubUser } = await githubAPi.get<GitHubUser>("user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });

  const existingUser = await db().query.users.findFirst({
    where: eq(users.authId, githubUser.id.toString()),
  });
  if (existingUser) {
    const authResponse = {
      userId: existingUser.id,
      githubAuthToken: access_token,
    };
    const token = jwt.sign(authResponse, process.env.JWT_SECRET!);
    return Response.json(token);
  }

  const { data: emailData } = await githubAPi.get<GitHubEmail[]>(
    "user/emails",
    {
      headers: {
        Authorization: `token ${access_token}`,
      },
    }
  );
  const email = emailData.find((e) => e.primary)?.email;
  if (!email)
    return Response.json({ error: "No primary email found" }, { status: 400 });

  const user = (
    await db()
      .insert(users)
      .values({
        authId: githubUser.id.toString(),
        email: email,
        name: githubUser.name,
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
    githubAuthToken: access_token,
  };
  const token = jwt.sign(authResponse, process.env.JWT_SECRET!);
  return Response.json(token);
}
