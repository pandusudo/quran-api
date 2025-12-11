import { Router } from "express";
import { ReadingPlanController } from "../controllers/reading-plan.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ValidateMiddleware } from "../middlewares/validate.middleware";
import { ReadingPlanCreateDTO } from "../dtos/reading-plan/create-reading-plan";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ValidateMiddleware.validateData(ReadingPlanCreateDTO),
  ReadingPlanController.createReadingPlan
);
router.put(
  "/:readingPlanId",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ValidateMiddleware.validateData(ReadingPlanCreateDTO),
  ReadingPlanController.updateReadingPlan
);
router.delete(
  "/:readingPlanId",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ReadingPlanController.deleteReadingPlan
);
router.get(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ReadingPlanController.getReadingPlansByUserId
);

export { router as readingPlanRouters };
