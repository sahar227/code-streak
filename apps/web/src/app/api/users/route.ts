export async function GET() {
  console.log("GET /api/users");
  const users = { hello: "world" };
  return Response.json(users);
}
