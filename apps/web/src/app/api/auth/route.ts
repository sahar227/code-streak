import axios from "axios";
import { z } from "zod";

const codeSchema = z.object({ code: z.string() });

const cliendId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_SECRET;

console.log("clientId:", cliendId);
console.log("clientSecret:", clientSecret);

export async function POST(req: Request) {
  console.log("POST /api/auth");

  // get code from body
  const body = await req.json();
  const code = codeSchema.parse(body).code;
  console.log("code:", code);

  const {
    data: { access_token },
  } = await axios.post<{ access_token: string }>(
    "https://github.com/login/oauth/access_token",
    {
      client_id: cliendId,
      client_secret: clientSecret,
      code,
    }
  );

  const { data } = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });

  //console.log(data);

  return Response.json(data);
}
