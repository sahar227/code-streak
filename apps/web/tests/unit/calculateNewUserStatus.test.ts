import { calculateNewUserStatus } from "@/features/syncCommits";
import { UserStatusBuilder } from "./_testUtils/UserStatusBuilder";

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
});
