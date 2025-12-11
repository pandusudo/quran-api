import { prisma } from "../lib/prisma";
import { ReadingHistory } from "../generated/prisma/client";
import { DashboardService } from "./dashboard.service";

type AchievementRule = (
  history: ReadingHistory[],
  userId: string
) => Promise<boolean> | boolean;

export class AchievementService {
  static serviceName = "Achievement Service";

  private static rules: Record<string, AchievementRule> = {
    FIRST_READING: (history) => history.length >= 1,
    READ_SURAH_AL_KAHF: (history) => history.some((h) => h.surahId === 18),
    STREAK_7_DAYS: (history) => {
      const streak = DashboardService.calculateStreak(history);
      return streak >= 7;
    },
  };

  static async checkAchievements(userId: string) {
    try {
      const achievements = await prisma.achievement.findMany();
      if (achievements.length === 0) return;

      const history = await prisma.readingHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      const existingUserAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true },
      });
      const unlockedAchievementIds = new Set(
        existingUserAchievements.map((ua) => ua.achievementId)
      );

      const newAchievements = [];

      for (const achievement of achievements) {
        if (unlockedAchievementIds.has(achievement.id)) continue;

        const rule = this.rules[achievement.slug];
        if (rule) {
          const isUnlocked = await rule(history, userId);
          if (isUnlocked) {
            newAchievements.push({
              userId,
              achievementId: achievement.id,
            });
          }
        }
      }

      if (newAchievements.length > 0) {
        await prisma.userAchievement.createMany({
          data: newAchievements,
          skipDuplicates: true,
        });
        return newAchievements;
      }

      return [];
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  }

  static async getUserAchievements(userId: string) {
    try {
      const allAchievements = await prisma.achievement.findMany();

      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        select: {
          achievementId: true,
          unlockedAt: true,
        },
      });

      const unlockedMap = new Map(
        userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt])
      );

      const achievementsWithStatus = allAchievements.map((achievement) => ({
        ...achievement,
        unlocked: unlockedMap.has(achievement.id),
        unlockedAt: unlockedMap.get(achievement.id) || null,
      }));

      return achievementsWithStatus;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
