import { getUsers, insertUser, insertUserSchema } from "../../../../db";

export async function POST(req: Request) {
  const body = await req.json();
  const userInsertRequest = insertUserSchema.safeParse(body);
  if (!userInsertRequest.success) {
    return Response.json(userInsertRequest.error, {
      status: 400,
    });
  }
  const user = await insertUser(userInsertRequest.data);
  return Response.json(user);
}

export async function GET() {
  const users = await getUsers();
  return Response.json(users);
}
