import type { Request, Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";
import { VerseService } from "../services/verse.service";

export class VerseController {
  static async getVersesByPageNumber(req: Request, res: Response) {
    try {
      const { pageNumber } = req.params;
      const verses = await VerseService.getVersesByPageNumber(
        parseInt(pageNumber)
      );
      ResponseHandler.success(res, 200, "Verses fetched successfully", verses);
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
