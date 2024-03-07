import { applyPushEvent, calculateNewUserStatus } from "@/features/syncCommits";
import { UserStatusBuilder } from "./_testUtils/UserStatusBuilder";

describe("applyPushEvent", () => {
  it("should return the same user status if we somhow process an event from the past", () => {
    const pushedAt = new Date(2024, 3, 2, 10);
    const streakExtendedAt = new Date(2024, 3, 3, 8); // We extended the streak later then the current push we are processing!
    const now = new Date(2024, 3, 3, 11);

    const userStatus = new UserStatusBuilder(undefined, now)
      .withStreakExtendedAt(streakExtendedAt)
      .build();
    const push = {
      pushedAt: pushedAt.toISOString(),
      commitMessages: [],
      repo: "test",
    };
    const newStatus = applyPushEvent(push, userStatus, now);
    expect(newStatus).toEqual(userStatus);
  });

  it("should increment the streak if push was made the day after the last push", () => {
    const lastStreakExtension = new Date(2024, 3, 2, 8);
    const pushedAt = new Date(2024, 3, 3, 10);
    const now = new Date(2024, 3, 3, 11);

    const userStatus = new UserStatusBuilder(undefined, now)
      .withLastUpdateDaysAgo(1)
      .withStreakExtendedAt(lastStreakExtension)
      .withCurrentStreak(1)
      .withLongestStreak(1)
      .build();

    const push = {
      pushedAt: pushedAt.toISOString(),
      commitMessages: [],
      repo: "test",
    };

    const newStatus = applyPushEvent(push, userStatus, now);
    const expected = {
      ...userStatus,
      lastUpdatedAt: now,
      currentStreak: 2,
      longestStreak: 2,
      streakExtendedAt: new Date(push.pushedAt),
    };
    expect(newStatus).toEqual(expected);
  });

  it("should NOT increment the streak if push was made the same day as the last push", () => {
    const lastStreakExtension = new Date(2024, 3, 3, 8);
    const pushedAt = new Date(2024, 3, 3, 10);
    const now = new Date(2024, 3, 3, 11);

    const userStatus = new UserStatusBuilder(undefined, now)
      .withLastUpdateDaysAgo(1)
      .withStreakExtendedAt(lastStreakExtension)
      .withCurrentStreak(1)
      .withLongestStreak(1)
      .build();

    const push = {
      pushedAt: pushedAt.toISOString(),
      commitMessages: [],
      repo: "test",
    };

    const newStatus = applyPushEvent(push, userStatus, now);
    const expected = {
      ...userStatus,
      lastUpdatedAt: now,
      currentStreak: 1,
      longestStreak: 1,
      streakExtendedAt: new Date(push.pushedAt),
    };
    expect(newStatus).toEqual(expected);
  });
});
