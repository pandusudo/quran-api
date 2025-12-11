import type { Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";
import { DashboardService } from "../services/dashboard.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class DashboardController {
  static async getDashboardData(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const dashboardData = await DashboardService.getDashboardData(userId!);

      ResponseHandler.success(
        res,
        200,
        "Dashboard data fetched successfully",
        dashboardData
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
