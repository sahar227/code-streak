import { z } from "zod";
import { authWithGithubCode } from "./authenticate";

const codeSchema = z.object({ code: z.string() });

export async function POST(req: Request) {
  const body = await req.json();
  const code = codeSchema.parse(body).code;

  const authResponse = await authWithGithubCode(code);
  if (authResponse.isSuccess === false) {
    return Response.json({ error: authResponse.error }, { status: 400 });
  }

  return Response.json(authResponse);
}
