import { calculateNewUserStatus } from "@/features/syncCommits";
import { UserStatusBuilder } from "./_testUtils/UserStatusBuilder";

function toStartOfDay(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function getDatehoursAgo(hours: number) {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
}

describe("calculateNewUserStatus", () => {
  it("should return the same user status if there are no new pushes", () => {
    const currentUserStatus = new UserStatusBuilder().build();
    const now = new Date();
    const newStatus = calculateNewUserStatus([], currentUserStatus, now);
    const expected = { ...currentUserStatus, lastUpdatedAt: now };
    expect(newStatus).toEqual(expected);
  });

  it("should NOT reset streak if there are no pushes today", () => {
    const currentUserStatus = new UserStatusBuilder()
      .withCurrentStreak(1)
      .withLongestStreak(1)
      .build();
    const now = new Date();
    const newStatus = calculateNewUserStatus([], currentUserStatus, now);
    const expected = {
      ...currentUserStatus,
      lastUpdatedAt: now,
      currentStreak: 1,
    };
    expect(newStatus).toEqual(expected);
  });

  it("should reset streak if there were no pushes since yesterday", () => {
    const currentUserStatus = new UserStatusBuilder()
      .withCurrentStreak(1)
      .withLongestStreak(1)
      .withLastUpdateDaysAgo(1)
      .build();
    const now = new Date();
    const newStatus = calculateNewUserStatus([], currentUserStatus, now);
    const expected = {
      ...currentUserStatus,
      lastUpdatedAt: now,
      currentStreak: 0,
    };
    expect(newStatus).toEqual(expected);
  });

  it("should increment streak if there were pushes today", () => {
    const now = new Date(2024, 3, 3, 11);
    const pushedAt = new Date(2024, 3, 3, 10); // pushed 1 hour before now

    const currentUserStatus = new UserStatusBuilder()
      .withCurrentStreak(1)
      .withLongestStreak(1)
      .withLastUpdateDaysAgo(0, now)
      .build();
    const newStatus = calculateNewUserStatus(
      [{ pushedAt: pushedAt.toISOString(), commitMessages: [], repo: "test" }],
      currentUserStatus,
      now
    );
    const expected = {
      ...currentUserStatus,
      lastUpdatedAt: now,
      currentStreak: 2,
      longestStreak: 2,
      streakExtendedAt: toStartOfDay(pushedAt),
    };
    expect(newStatus).toEqual(expected);
  });
});
