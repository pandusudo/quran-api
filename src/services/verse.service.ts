import { throwError } from "../helpers/error-thrower";
import { fetchQuranAPi } from "../helpers/fetch";
import cache from "../lib/cache-manager";
import { ChapterService } from "./chapter.service";

export class VerseService {
  static serviceName = "Verse Service";

  static async getVersesByPageNumber(pageNumber: number) {
    try {
      const cachedVerses = await cache.get(`verses_page_${pageNumber}`);

      if (cachedVerses) return cachedVerses;

      const translations = await fetchQuranAPi(
        "get",
        `/resources/translations?language=en`
      );

      const langIds = (translations.translations || []).map(
        (translation: any) => {
          if (translation.language_name === "english") return translation.id;
        }
      );

      const reciters = await fetchQuranAPi("get", `/resources/recitations`);
      const reciterId = reciters.recitations[0].id;

      const result = await fetchQuranAPi(
        "get",
        `/verses/by_page/${pageNumber}?fields=text_uthmani,chapter_id&audio=${reciterId}&translations=${langIds.join(",")}`
      );

      const hashmapId: Record<string, string> = {};

      for (const verse of result.verses) {
        if (!hashmapId[verse.chapter_id]) {
          const chapter = await ChapterService.getChapterById(verse.chapter_id);
          hashmapId[verse.chapter_id] = chapter.chapter.name_simple;
        }

        verse.chapter_name_simple = hashmapId[verse.chapter_id];
      }

      await cache.set(`verses_page_${pageNumber}`, result);

      return result;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }
}
