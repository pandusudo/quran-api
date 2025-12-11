import { BookmarkCreateDTOType } from "../dtos/bookmark/create-bookmark";
import { throwError } from "../helpers/error-thrower";
import cache from "../lib/cache-manager";
import { prisma } from "../lib/prisma";

export class BookmarkService {
  static serviceName = "Bookmark Service";

  static async deleteBookmark(bookmarkId: string, userId: string) {
    try {
      const bookmark = await prisma.bookmark.findFirst({
        where: {
          id: bookmarkId,
          userId: userId,
        },
      });

      if (!bookmark) {
        throw new Error("Bookmark not found");
      }

      await prisma.bookmark.delete({
        where: {
          id: bookmarkId,
        },
      });

      await cache.del(`bookmark_page_${bookmark.pageId}_user_${userId}`);

      return bookmark;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  static async createBookmark(body: BookmarkCreateDTOType, userId: string) {
    try {
      const { pageId, surahName, title } = body;

      const newBookmark = await prisma.bookmark.create({
        data: {
          title: title,
          surahName: surahName,
          pageId: pageId,
          userId: userId,
        },
      });

      await cache.del(`bookmark_page_${pageId}_user_${userId}`);

      return newBookmark;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  static async getBookmarkByPageId(pageId: number, userId: string) {
    try {
      const cachedBookmark = await cache.get(
        `bookmark_page_${pageId}_user_${userId}`
      );

      if (cachedBookmark) return cachedBookmark;

      const bookmark = await prisma.bookmark.findFirst({
        where: {
          userId: userId,
          pageId: pageId,
        },
      });

      await cache.set(`bookmark_page_${pageId}_user_${userId}`, bookmark);

      return bookmark;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  static async getMyBookmarks(userId: string) {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: userId,
        },
      });

      return bookmarks;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }
}
