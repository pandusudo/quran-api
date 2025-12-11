export interface DashboardDataInterface {
  streak: number;
  totalPagesRead: number;
  totalChaptersRead: number;
  totalAyahsRead: number;
  haveReadToday?: boolean;
  latestRead?: {
    pageId: number;
    surahId: number;
    surahName: string;
  } | null;
  todaysReadingPlans?: any[];
}
