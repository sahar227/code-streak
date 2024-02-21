import { githubClient } from "./githubClient";
import { GitHubUser } from "./githubTypes";

export async function getUser(accessToken: string) {
  const { data: githubUser } = await githubClient.get<GitHubUser>("user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  return githubUser;
}
