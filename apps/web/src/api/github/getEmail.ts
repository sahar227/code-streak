import { githubClient } from "./githubClient";
import { GitHubEmail } from "./githubTypes";

export async function getEmail(accessToken: string) {
  const { data: emailData } = await githubClient.get<GitHubEmail[]>(
    "user/emails",
    {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const email = emailData.find((e) => e.primary)?.email;

  return email;
}
