import type { Request, Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";
import { ChapterService } from "../services/chapter.service";

export class ChapterController {
  static async getChapters(req: Request, res: Response) {
    try {
      const chapters = await ChapterService.getChapters();
      ResponseHandler.success(
        res,
        200,
        "Chapters fetched successfully",
        chapters
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async getChapterById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const chapter = await ChapterService.getChapterById(id);
      ResponseHandler.success(
        res,
        200,
        "Chapter fetched successfully",
        chapter
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
