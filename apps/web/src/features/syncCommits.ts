import { PushEvent, getLatestCommits } from "@/api/github/getLatestCommits";
import { db } from "@/db";
import { githubProfiles, userStatuses } from "@/db/schema";
import { eq } from "drizzle-orm";

type UserStatus = typeof userStatuses.$inferSelect;
type GithubProfile = typeof githubProfiles.$inferSelect;

export const syncCommits = async (
  githubAuthToken: string,
  gitHubLogin: string,
  userStatus: UserStatus
) => {
  const newPushes = await getLatestCommits(
    githubAuthToken,
    gitHubLogin,
    userStatus.lastUpdatedAt
  );

  console.log("Syncing commits", newPushes);

  const newStatus = calculateNewUserStatus(newPushes, userStatus);

  await db()
    .update(userStatuses)
    .set(newStatus)
    .where(eq(userStatuses.userId, userStatus.userId));

  return newStatus;
};

export function calculateNewUserStatus(
  pushes: PushEvent[],
  currentUserStatus: UserStatus,
  now = new Date()
): UserStatus {
  let newStatus = { ...currentUserStatus };
  for (const push of pushes) {
    newStatus = applyPushEvent(push, newStatus, now);
  }
  if (newStatus.streakExtendedAt === null) return newStatus;

  const dayDifference = checkDayDifference(
    now,
    new Date(newStatus.streakExtendedAt)
  );

  if (dayDifference > 1) {
    newStatus = {
      ...newStatus,
      lastUpdatedAt: now,
      currentStreak: 0,
      streakExtendedAt: now,
    };
  }

  return newStatus;
}

export function applyPushEvent(
  push: PushEvent,
  userStatus: UserStatus,
  now: Date
) {
  const pushDate = new Date(push.pushedAt);
  let streakExtendedAt = userStatus.streakExtendedAt || new Date(0);
  // If push was made before the last update, we just return the current status
  if (pushDate < streakExtendedAt) {
    console.log("push event was made before the last update, skipping it");
    return userStatus;
  }

  const dayDifference = checkDayDifference(pushDate, streakExtendedAt);
  if (dayDifference === 0) {
    // We already have a push for today, no need to update the streak
    return {
      ...userStatus,
      streakExtendedAt: pushDate,
      lastUpdatedAt: now,
    };
  }

  // If new commit is made the day after the last commit, we extend the streak
  if (dayDifference === 1) {
    const newStreak = userStatus.currentStreak + 1;
    return {
      ...userStatus,
      lastUpdatedAt: now,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, userStatus.longestStreak),
      streakExtendedAt: pushDate,
    };
  }

  return {
    ...userStatus,
    lastUpdatedAt: now,
    currentStreak: 1,
    streakExtendedAt: pushDate,
  };
}

function checkDayDifference(date1: Date, date2: Date) {
  const dayDifference =
    Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
  return Math.floor(dayDifference);
}
