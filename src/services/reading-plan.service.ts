import { ReadingPlanCreateDTOType } from "../dtos/reading-plan/create-reading-plan";
import { ReadingPlanUpdateDTOType } from "../dtos/reading-plan/update-reading-plan";
import { ReadingHistory } from "../generated/prisma/client";
import { ReadingPlanFrequency } from "../generated/prisma/enums";
import { throwError } from "../helpers/error-thrower";
import { prisma } from "../lib/prisma";

export class ReadingPlanService {
  static serviceName = "Reading plan Service";

  static async createReadingPlan(
    body: ReadingPlanCreateDTOType,
    userId: string
  ) {
    try {
      const {
        amount,
        filter,
        frequency,
        title,
        icon,
        customDay,
        chapterId,
        chapterName,
        chapterPages,
      } = body;

      const newReadingPlan = await prisma.readingPlan.create({
        data: {
          amount: amount,
          filter: filter,
          frequency: frequency,
          userId: userId,
          title: title,
          icon: icon,
          customDay: customDay,
          chapterId: chapterId,
          chapterName: chapterName,
          chapterPages: chapterPages,
        },
      });

      return newReadingPlan;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }

  static async updateReadingPlan(
    readingPlanId: string,
    body: ReadingPlanUpdateDTOType,
    userId: string
  ) {
    try {
      const {
        amount,
        filter,
        frequency,
        title,
        icon,
        customDay,
        chapterId,
        chapterName,
        chapterPages,
      } = body;

      const updatedReadingPlan = await prisma.readingPlan.update({
        where: { id: readingPlanId, userId: userId },
        data: {
          amount: amount,
          filter: filter,
          frequency: frequency,
          title: title,
          icon: icon,
          customDay: customDay,
          chapterId: chapterId,
          chapterName: chapterName,
          chapterPages: chapterPages,
        },
      });

      return updatedReadingPlan;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }

  static async deleteReadingPlan(readingPlanId: string, userId: string) {
    try {
      const deletedReadingPlan = await prisma.readingPlan.delete({
        where: { id: readingPlanId, userId: userId },
      });

      return deletedReadingPlan;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }

  static async getReadingPlanByUserId(userId: string) {
    try {
      const readingPlans = await prisma.readingPlan.findMany({
        where: { userId: userId },
        include: {
          user: {
            select: {
              readingHistory: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      this.assignCompletionStatus(readingPlans);

      return readingPlans;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }

  private static getFilteredHistory(
    plan: any,
    frequency: ReadingPlanFrequency
  ): ReadingHistory[] {
    const now = new Date();

    switch (frequency) {
      case ReadingPlanFrequency.DAILY:
        return plan.user.readingHistory.filter((history: ReadingHistory) => {
          const historyDate = new Date(history.createdAt);
          return historyDate.toDateString() === now.toDateString();
        });

      case ReadingPlanFrequency.WEEKLY:
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        return plan.user.readingHistory.filter((history: ReadingHistory) => {
          const historyDate = new Date(history.createdAt);
          return historyDate >= startOfWeek && historyDate <= endOfWeek;
        });

      case ReadingPlanFrequency.MONTHLY:
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);

        return plan.user.readingHistory.filter((history: ReadingHistory) => {
          const historyDate = new Date(history.createdAt);
          return historyDate >= startOfMonth && historyDate < endOfMonth;
        });

      case ReadingPlanFrequency.CUSTOM_DAY:
        const dayNow = new Date().getDay();
        if (dayNow < plan.customDay) {
          return [];
        }

        const customDayDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - (now.getDay() - plan.customDay)
        );

        return plan.user.readingHistory.filter((history: ReadingHistory) => {
          const historyDate = new Date(history.createdAt);
          return historyDate.toDateString() === customDayDate.toDateString();
        });

      default:
        return [];
    }
  }

  private static calculateProgress(
    history: ReadingHistory[],
    filter: string,
    amount: number,
    chapterPages?: string
  ): { progress: number; completed: boolean } {
    switch (filter) {
      case "AYAH": {
        const totalAyahs = history.reduce(
          (acc: number, h: ReadingHistory) => acc + (h.ayahNumber || 0),
          0
        );
        return {
          progress: totalAyahs < amount ? (totalAyahs / amount) * 100 : 100,
          completed: totalAyahs >= amount,
        };
      }

      case "PAGE": {
        return {
          progress:
            history.length < amount ? (history.length / amount) * 100 : 100,
          completed: history.length >= amount,
        };
      }

      case "JUZ": {
        const uniqueJuzNumbers = new Set<number>();
        history.forEach((h: ReadingHistory) => {
          uniqueJuzNumbers.add(h.juzNumber);
        });

        return {
          progress:
            uniqueJuzNumbers.size < amount
              ? (uniqueJuzNumbers.size / amount) * 100
              : 100,
          completed: uniqueJuzNumbers.size >= amount,
        };
      }

      case "SURAH": {
        const pagesString = JSON.parse(chapterPages || "[]");
        const firstPage = pagesString[0] || 1;
        const lastPage = pagesString[pagesString.length - 1] || 1;

        const hasReadAllPages = (range: number[], readPages: number[]) => {
          const readSet = new Set(readPages);
          let missing = 0;
          const [start, end] = range;
          for (let p = start; p <= end; p++) {
            if (!readSet.has(p)) missing++;
          }
          return { completed: missing === 0, missing };
        };

        const { completed, missing } = hasReadAllPages(
          [firstPage, lastPage],
          history.map((h: ReadingHistory) => h.pageId || 0)
        );

        return {
          progress:
            missing === 0 ? 100 : ((lastPage - missing) / lastPage) * 100,
          completed,
        };
      }

      default:
        return { progress: 0, completed: false };
    }
  }

  static assignCompletionStatus(readingPlans: any[]) {
    readingPlans.forEach((plan: any) => {
      const filteredHistory = this.getFilteredHistory(plan, plan.frequency);
      if (plan.frequency === ReadingPlanFrequency.CUSTOM_DAY)
        console.log(filteredHistory);
      const { progress, completed } = this.calculateProgress(
        filteredHistory,
        plan.filter,
        plan.amount,
        plan.chapterPages
      );

      plan.progress = Math.floor(progress);
      plan.completed = completed;
    });
  }
}
