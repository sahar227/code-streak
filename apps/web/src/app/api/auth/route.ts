import { githubAPi } from "@/api";
import { z } from "zod";
import { GitHubEmail, GitHubUser } from "./githubTypes";
import { db } from "@/db";
import { users } from "@/db/schema";

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

  console.log(githubUser);

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

  const codeStreakUser = {
    email,
    githubId: githubUser.id,
    username: githubUser.login,
    gitHubUrl: githubUser.url,
    repos_url: githubUser.repos_url,
  };

  const [user] = await db()
    .insert(users)
    .values({ authId: githubUser.id.toString(), email: email })
    .returning({ id: users.id });

  return Response.json(githubUser);
}
