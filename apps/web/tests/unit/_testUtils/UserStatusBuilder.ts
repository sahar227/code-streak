import { userStatuses } from "@/db/schema";

type UserStatus = typeof userStatuses.$inferSelect;

const extendedDate = new Date();
extendedDate.setHours(0, 0, 0, 0); // extended date should alaways be at midnight

const defaultValue: UserStatus = {
  userId: 1,
  xp: 0,
  currentStreak: 0,
  longestStreak: 0,
  streakExtendedAt: extendedDate,
  lastUpdatedAt: new Date(),
};

export class UserStatusBuilder {
  constructor(private userStatus = defaultValue) {}

  withCurrentStreak(currentStreak: number) {
    this.userStatus.currentStreak = currentStreak;
    return this;
  }

  withLongestStreak(longestStreak: number) {
    this.userStatus.longestStreak = longestStreak;
    return this;
  }

  withLastUpdateDaysAgo(lastUpdateDaysAgo: number) {
    const lastUpdatedAt = new Date();
    lastUpdatedAt.setDate(lastUpdatedAt.getDate() - lastUpdateDaysAgo);
    this.userStatus.lastUpdatedAt = lastUpdatedAt;
    return this;
  }

  build() {
    return this.userStatus;
  }
}
