import { getLatestCommits } from "@/api/github/getLatestCommits";
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

  if (newPushes.length === 0) {
    console.log("No new commits to sync");
    await db().update(userStatuses).set({ lastUpdatedAt: new Date() });
    return;
  }

  console.log("Syncing commits", newPushes);

  const pushesByDay = newPushes.reduce((acc, push) => {
    const date = new Date(push.pushedAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(push);
    return acc;
  }, {} as Record<string, typeof newPushes>);

  let newStreak = userStatus.currentStreak;
  let newLongestStreak = userStatus.longestStreak;
  let streakExtendedAt = new Date(userStatus?.streakExtendedAt ?? 0);
  streakExtendedAt.setHours(0, 0, 0, 0);
  let dateIndex = new Date(userStatus.lastUpdatedAt);
  dateIndex.setHours(0, 0, 0, 0);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  while (dateIndex <= todayDate) {
    const date = dateIndex.toDateString();
    if (pushesByDay[date] && pushesByDay[date].length > 0) {
      if (dateIndex > streakExtendedAt) {
        newStreak++;
        newLongestStreak = Math.max(newStreak, newLongestStreak);
        streakExtendedAt = new Date(dateIndex);
      }
    }
    // If it's today, user still has a chance to extend the streak
    else if (dateIndex !== todayDate) {
      newStreak = 0;
    }
    // set dateIndex to the next day
    dateIndex.setDate(dateIndex.getDate() + 1);
  }

  await db().update(userStatuses).set({
    lastUpdatedAt: new Date(),
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    streakExtendedAt: streakExtendedAt,
  });
};
