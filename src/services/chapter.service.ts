import { throwError } from "../helpers/error-thrower";
import { fetchQuranAPi } from "../helpers/fetch";
import cache from "../lib/cache-manager";

export class ChapterService {
  static serviceName = "Chapter Service";

  static async getChapters() {
    try {
      const cachedChapters = await cache.get("chapters");

      if (cachedChapters) return cachedChapters;

      const chapters = await fetchQuranAPi("get", "/chapters");

      await cache.set("chapters", chapters);

      return chapters;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  static async getChapterById(id: number) {
    try {
      const cachedChapter = await cache.get(`chapter_${id}`);

      if (cachedChapter) return cachedChapter;

      const chapter = await fetchQuranAPi("get", `/chapters/${id}`);

      await cache.set(`chapter_${id}`, chapter);

      return chapter;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }
}
