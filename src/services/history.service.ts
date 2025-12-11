import { HistoryCreateDTOType } from "../dtos/history/create-reading-history";
import { AchievementService } from "./achievement.service";
import { ReadingHistory } from "../generated/prisma/client";
import { normalizeDate } from "../helpers/date";
import { throwError } from "../helpers/error-thrower";
import { prisma } from "../lib/prisma";

export class HistoryService {
  static serviceName = "History Service";

  static async createHistory(body: HistoryCreateDTOType, userId: string) {
    try {
      const { pageId, surahId, ayahNumber, surahName, juzNumber } = body;

      const todayHistory = await prisma.readingHistory.findFirst({
        where: {
          userId: userId,
          pageId: pageId,
          surahId: surahId,
          ayahNumber: ayahNumber,
          juzNumber: juzNumber,
          createdAt: { gte: new Date(normalizeDate(new Date())) },
        },
      });

      if (todayHistory) {
        return todayHistory;
      }

      const newHistory = await prisma.readingHistory.create({
        data: {
          pageId: pageId,
          surahId: surahId,
          surahName: surahName,
          ayahNumber: ayahNumber,
          juzNumber: juzNumber,
          userId: userId,
        },
      });

      await AchievementService.checkAchievements(userId);

      return newHistory;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }

  static async getHistoryByUserId(
    userId: string
  ): Promise<ReadingHistory[] | undefined> {
    try {
      const histories = await prisma.readingHistory.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
      });
      return histories;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }
}
