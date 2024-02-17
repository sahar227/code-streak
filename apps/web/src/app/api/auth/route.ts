import { githubAPi } from "@/api";
import { z } from "zod";

const codeSchema = z.object({ code: z.string() });

const cliendId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_SECRET;

export async function POST(req: Request) {
  // get code from body
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

  const { data: user } = await githubAPi.get("user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });

  console.log(user);

  const { data: emailData } = await githubAPi.get("user/emails", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });
  console.log("emailData:", emailData);

  return Response.json(user);
}
