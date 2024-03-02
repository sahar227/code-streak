import { PushEvent, getLatestCommits } from "@/api/github/getLatestCommits";
import { db } from "@/db";
import { githubProfiles, userStatuses } from "@/db/schema";

type UserStatus = typeof userStatuses.$inferSelect;
type GithubProfile = typeof githubProfiles.$inferSelect;

export const syncCommits = async (
  githubAuthToken: string,
  gitHubProfile: GithubProfile,
  userStatus: UserStatus
) => {
  const newPushes = await getLatestCommits(
    githubAuthToken,
    gitHubProfile.githubUserId,
    userStatus.lastUpdatedAt
  );

  console.log("Syncing commits", newPushes);

  const newStatus = calculateNewUserStatus(newPushes, userStatus);

  await db().update(userStatuses).set(newStatus);
};

export function calculateNewUserStatus(
  pushes: PushEvent[],
  currentUserStatus: UserStatus,
  now = new Date()
): UserStatus {
  if (pushes.length === 0) {
    console.log("No new commits to sync");
  }

  const pushesByDay = pushes.reduce((acc, push) => {
    const date = new Date(push.pushedAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(push);
    return acc;
  }, {} as Record<string, typeof pushes>);

  let newStreak = currentUserStatus.currentStreak;
  let newLongestStreak = currentUserStatus.longestStreak;
  let streakExtendedAt = new Date(currentUserStatus?.streakExtendedAt ?? 0);
  streakExtendedAt.setHours(0, 0, 0, 0);
  let dateIndex = new Date(currentUserStatus.lastUpdatedAt);
  dateIndex.setHours(0, 0, 0, 0);
  const todayDate = new Date(now);
  todayDate.setHours(0, 0, 0, 0);

  while (dateIndex <= todayDate) {
    const date = dateIndex.toDateString();
    const eventExists = pushesByDay[date] && pushesByDay[date].length > 0;
    if (eventExists) {
      newStreak++;
      newLongestStreak = Math.max(newStreak, newLongestStreak);
      streakExtendedAt = new Date(dateIndex);
    }
    // If it's today, user still has a chance to extend the streak
    else if (dateIndex.toDateString() !== todayDate.toDateString()) {
      newStreak = 0;
    }
    // set dateIndex to the next day
    dateIndex.setDate(dateIndex.getDate() + 1);
  }

  return {
    ...currentUserStatus,
    lastUpdatedAt: now,
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    streakExtendedAt: streakExtendedAt,
  };
}
