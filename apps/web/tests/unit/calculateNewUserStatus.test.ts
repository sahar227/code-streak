import { calculateNewUserStatus } from "@/features/syncCommits";

const getUserStatus = (currentStreak: number, longestStreak: number) => {
  const extendedDate = new Date();
  extendedDate.setHours(0, 0, 0, 0); // extended date should alaways be at midnight
  return {
    userId: 1,
    xp: 0,
    currentStreak,
    longestStreak,
    streakExtendedAt: extendedDate,
    lastUpdatedAt: new Date(),
  };
};

describe("calculateNewUserStatus", () => {
  it("should return the same user status if there are no new pushes", () => {
    const currentUserStatus = getUserStatus(0, 0);
    const now = new Date();
    const newStatus = calculateNewUserStatus([], currentUserStatus, now);
    const expected = { ...currentUserStatus, lastUpdatedAt: now };
    expect(newStatus).toEqual(expected);
  });

  it("should NOT reset streak if there are no pushes today", () => {
    const currentUserStatus = getUserStatus(1, 1);
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
    const currentUserStatus = getUserStatus(1, 1);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    currentUserStatus.lastUpdatedAt = yesterday;
    const now = new Date();
    const newStatus = calculateNewUserStatus([], currentUserStatus, now);
    const expected = {
      ...currentUserStatus,
      lastUpdatedAt: now,
      currentStreak: 0,
    };
    expect(newStatus).toEqual(expected);
  });
});
