import { isSameDay, minusDays, normalizeDate } from "../helpers/date";
import { throwError } from "../helpers/error-thrower";
import { DashboardDataInterface } from "../interfaces/dashboard.interface";
import { HistoryService } from "./history.service";
import { prisma } from "../lib/prisma";
import { ReadingPlanFrequency } from "../generated/prisma/enums";
import { ReadingPlanService } from "./reading-plan.service";

export class DashboardService {
  static serviceName = "Dashboard Service";

  static async getDashboardData(
    userId: string
  ): Promise<DashboardDataInterface | undefined> {
    try {
      const userHistory = await HistoryService.getHistoryByUserId(userId);

      if (!userHistory || userHistory.length === 0) {
        return {
          streak: 0,
          totalPagesRead: 0,
          totalChaptersRead: 0,
          totalAyahsRead: 0,
          haveReadToday: false,
          latestRead: null,
          todaysReadingPlans: [],
        };
      }

      const streak = this.calculateStreak(userHistory);
      const totalPagesRead = this.calculateTotalPages(userHistory);
      const totalChaptersRead = this.calculateTotalChapters(userHistory);
      const totalAyahsRead = this.calculateTotalAyahs(userHistory);
      const haveReadToday = this.haveReadToday(userHistory);

      const latestRead = userHistory[0]
        ? {
            pageId: userHistory[0].pageId,
            surahId: userHistory[0].surahId,
            surahName: userHistory[0].surahName,
          }
        : null;

      const todaysReadingPlans = await this.getTodaysReadingPlans(userId);

      return {
        streak,
        totalPagesRead,
        totalChaptersRead,
        totalAyahsRead,
        haveReadToday,
        latestRead,
        todaysReadingPlans,
      };
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  private static async getTodaysReadingPlans(userId: string) {
    const allPlans = await prisma.readingPlan.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            readingHistory: true,
          },
        },
      },
    });

    const today = new Date();
    const currentDay = today.getDay();

    const todaysPlans = allPlans.filter((plan) => {
      switch (plan.frequency) {
        case ReadingPlanFrequency.DAILY:
          return true;

        case ReadingPlanFrequency.WEEKLY:
          return true;

        case ReadingPlanFrequency.MONTHLY:
          return true;

        case ReadingPlanFrequency.CUSTOM_DAY:
          return plan.customDay === currentDay;

        default:
          return false;
      }
    });

    ReadingPlanService.assignCompletionStatus(todaysPlans);

    return todaysPlans;
  }

  static calculateStreak(history: any[]): number {
    if (!history || history.length === 0) return 0;

    const today = normalizeDate(new Date());
    const yesterday = minusDays(today, 1);
    const newest = normalizeDate(history[0].createdAt);

    let currentDay: Date;

    if (isSameDay(newest, today)) {
      currentDay = today;
    } else if (isSameDay(newest, yesterday)) {
      currentDay = yesterday;
    } else {
      return 0;
    }

    let streak = 1;
    let expectedDay = minusDays(currentDay, 1);

    for (let i = 1; i < history.length; i++) {
      const day = normalizeDate(history[i].createdAt);

      if (isSameDay(day, expectedDay)) {
        streak++;
        expectedDay = minusDays(expectedDay, 1);
      } else if (day < expectedDay) {
        break;
      }
    }

    return streak;
  }

  private static calculateTotalPages(history: any[]): number {
    const uniquePages = new Set<number>();
    history.forEach((entry) => {
      uniquePages.add(entry.pageId);
    });
    return uniquePages.size;
  }

  private static calculateTotalChapters(history: any[]): number {
    const uniqueSurahs = new Set<number>();
    history.forEach((entry) => {
      uniqueSurahs.add(entry.surahId);
    });
    return uniqueSurahs.size;
  }

  private static calculateTotalAyahs(history: any[]): number {
    return history.reduce((total, entry) => {
      return total + (entry.ayahNumber || 0);
    }, 0);
  }

  private static haveReadToday(history: any[]): boolean {
    if (!history || history.length === 0) return false;

    const today = normalizeDate(new Date());

    return history.some((entry) => {
      const entryDate = normalizeDate(new Date(entry.createdAt));
      return isSameDay(entryDate, today);
    });
  }
}
