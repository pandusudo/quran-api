import type { Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { BookmarkService } from "../services/bookmark.service";

export class BookmarkController {
  static async createBookmark(req: AuthenticatedRequest, res: Response) {
    try {
      const bookmarkData = req.body;
      const userId = req.user?.id;
      const newBookmark = await BookmarkService.createBookmark(
        bookmarkData,
        userId!
      );
      ResponseHandler.success(
        res,
        201,
        "Bookmark created successfully",
        newBookmark
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async getBookmarkByPageId(req: AuthenticatedRequest, res: Response) {
    try {
      const pageId = parseInt(req.params.pageId, 10);
      const userId = req.user?.id;
      const bookmark = await BookmarkService.getBookmarkByPageId(
        pageId,
        userId!
      );
      ResponseHandler.success(
        res,
        200,
        "Bookmark fetched successfully",
        bookmark
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async deleteBookmark(req: AuthenticatedRequest, res: Response) {
    try {
      const bookmarkId = req.params.bookmarkId;
      const userId = req.user?.id;
      const deletedBookmark = await BookmarkService.deleteBookmark(
        bookmarkId,
        userId!
      );
      ResponseHandler.success(
        res,
        200,
        "Bookmark deleted successfully",
        deletedBookmark
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async getMyBookmarks(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const bookmarks = await BookmarkService.getMyBookmarks(userId!);
      ResponseHandler.success(
        res,
        200,
        "My bookmarks fetched successfully",
        bookmarks
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
