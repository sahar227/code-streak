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

  const isExtendedToday =
    !!userStatus.streakExtendedAt &&
    checkIsExtendedToday(userStatus.streakExtendedAt);

  // if we didn't yet extend the streak today, we need to do it now
  //   await db()
  //     .update(userStatuses)
  //     .set({
  //       lastUpdatedAt: new Date(),
  //       currentStreak: userStatus.currentStreak + 1,
  //       longestStreak: Math.max(
  //         userStatus.currentStreak + 1,
  //         userStatus.longestStreak
  //       ),
  //       streakExtendedAt: new Date(),
  //     });
};

function checkIsExtendedToday(streakExtendedAt: Date) {
  return streakExtendedAt.toDateString() === new Date().toDateString();
}
