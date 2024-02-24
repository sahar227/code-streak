import { getUser } from "./getUser";

export async function GET(request: Request) {
  console.log("GET /api/users");

  const token = request.headers.get("Authorization")?.split("Bearer ")?.at(1);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUser(token);
  return Response.json(user);
}
