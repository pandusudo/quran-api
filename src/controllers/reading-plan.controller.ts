import type { Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";
import { ReadingPlanService } from "../services/reading-plan.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class ReadingPlanController {
  static async createReadingPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const readingPlanData = req.body;
      const userId = req.user?.id;
      const newReadingPlan = await ReadingPlanService.createReadingPlan(
        readingPlanData,
        userId!
      );
      ResponseHandler.success(
        res,
        201,
        "Reading plan created successfully",
        newReadingPlan
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async updateReadingPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const readingPlanId = req.params.readingPlanId;
      const userId = req.user?.id;
      const updatedReadingPlan = await ReadingPlanService.updateReadingPlan(
        readingPlanId,
        req.body,
        userId!
      );
      ResponseHandler.success(
        res,
        200,
        "Reading plan updated successfully",
        updatedReadingPlan
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async deleteReadingPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const readingPlanId = req.params.readingPlanId;
      const userId = req.user?.id;
      await ReadingPlanService.deleteReadingPlan(readingPlanId, userId!);
      ResponseHandler.success(
        res,
        200,
        "Reading plan deleted successfully",
        null
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async getReadingPlansByUserId(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const userId = req.user?.id;
      const readingPlans = await ReadingPlanService.getReadingPlanByUserId(
        userId!
      );
      ResponseHandler.success(
        res,
        200,
        "Reading plans fetched successfully",
        readingPlans
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
