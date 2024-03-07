import { userStatuses } from "@/db/schema";

type UserStatus = typeof userStatuses.$inferSelect;

export class UserStatusBuilder {
  private userStatus: UserStatus;
  private getDefaultUserStatus(): UserStatus {
    return {
      userId: 1,
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      streakExtendedAt: null,
      lastUpdatedAt: new Date(this.now),
    };
  }

  constructor(
    initialUserStatus = undefined as UserStatus | undefined,
    private now = new Date()
  ) {
    this.userStatus = initialUserStatus || this.getDefaultUserStatus();
  }

  withCurrentStreak(currentStreak: number) {
    this.userStatus.currentStreak = currentStreak;
    return this;
  }

  withLongestStreak(longestStreak: number) {
    this.userStatus.longestStreak = longestStreak;
    return this;
  }

  withLastUpdateDaysAgo(lastUpdateDaysAgo: number) {
    const lastUpdatedAt = new Date(this.now);
    lastUpdatedAt.setDate(lastUpdatedAt.getDate() - lastUpdateDaysAgo);
    this.userStatus.lastUpdatedAt = lastUpdatedAt;
    return this;
  }

  withStreakExtendedAt(streakExtendedAt: Date) {
    this.userStatus.streakExtendedAt = streakExtendedAt;
    return this;
  }

  build() {
    return this.userStatus;
  }
}
