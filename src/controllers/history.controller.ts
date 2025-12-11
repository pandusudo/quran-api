import type { Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { HistoryService } from "../services/history.service";

export class HistoryController {
  static async createHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const historyData = req.body;
      const userId = req.user?.id;
      const newHistory = await HistoryService.createHistory(
        historyData,
        userId!
      );
      ResponseHandler.success(
        res,
        201,
        "History created successfully",
        newHistory
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
