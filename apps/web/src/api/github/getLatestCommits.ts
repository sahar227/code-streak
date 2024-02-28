import { githubClient } from "./githubClient";
import { GitHubEvent } from "./githubTypes";

export async function getLatestCommits(
  githubAuthToken: string,
  gitHubLogin: string,
  dateFrom: Date
) {
  const { data: events } = await githubClient.get<GitHubEvent[]>(
    `users/${gitHubLogin}/events`,
    {
      headers: {
        Authorization: `token ${githubAuthToken}`,
      },
    }
  );
  const newEvents = events.filter(
    (event) => new Date(event.created_at) > dateFrom
  );
  const pushEvents = newEvents.filter((event) => event.type === "PushEvent");
  const commits = pushEvents
    .map((event) => ({
      commitMessages: event.payload.commits
        .filter((v) => v.distinct) // only include distinct commits
        .map((v) => v.message),
      repo: event.repo.name,
      pushedAt: event.created_at,
    }))
    .filter((commit) => commit.commitMessages.length > 0); // only include events with commits
  return commits;
}
