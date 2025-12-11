import { Response } from "express";
import { AchievementService } from "../services/achievement.service";
import { ResponseHandler } from "../helpers/response-handler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AchievementController {
  static async getAchievements(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const achievements = await AchievementService.getUserAchievements(
        userId!
      );

      ResponseHandler.success(
        res,
        200,
        "User achievements fetched successfully",
        achievements
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
