export class UserStatusBuilder {
  private currentStreak = 0;
  private longestStreak = 0;
  private lastUpdateDaysAgo = 0;

  withCurrentStreak(currentStreak: number) {
    this.currentStreak = currentStreak;
    return this;
  }

  withLongestStreak(longestStreak: number) {
    this.longestStreak = longestStreak;
    return this;
  }

  withLastUpdateDaysAgo(lastUpdateDaysAgo: number) {
    this.lastUpdateDaysAgo = lastUpdateDaysAgo;
    return this;
  }

  getUserStatus = (
    currentStreak = 0,
    longestStreak = 0,
    lastUpdateDaysAgo = 0
  ) => {
    const extendedDate = new Date();
    extendedDate.setHours(0, 0, 0, 0); // extended date should alaways be at midnight

    const lastUpdatedAt = new Date();
    lastUpdatedAt.setDate(lastUpdatedAt.getDate() - lastUpdateDaysAgo);

    return {
      userId: 1,
      xp: 0,
      currentStreak,
      longestStreak,
      streakExtendedAt: extendedDate,
      lastUpdatedAt,
    };
  };

  build() {
    return this.getUserStatus(
      this.currentStreak,
      this.longestStreak,
      this.lastUpdateDaysAgo
    );
  }
}
