import axios from "axios";

const cliendId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_SECRET;

export async function getTokenFromCode(code: string) {
  const {
    data: { access_token },
  } = await axios.post<{ access_token: string }>(
    "https://github.com/login/oauth/access_token",
    {
      client_id: cliendId,
      client_secret: clientSecret,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return access_token;
}
