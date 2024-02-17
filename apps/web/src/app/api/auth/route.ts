import { githubAPi } from "@/api";
import { z } from "zod";
import { GitHubEmail, GitHubUser } from "./githubTypes";

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

  const { data: user } = await githubAPi.get<GitHubUser>("user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });

  console.log(user);

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
    githubId: user.id,
    username: user.login,
    gitHubUrl: user.url,
    repos_url: user.repos_url,
  };

  return Response.json(user);
}
