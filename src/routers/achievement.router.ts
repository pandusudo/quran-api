import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AchievementController } from "../controllers/achievement.controller";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.get(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  AchievementController.getAchievements
);

export { router as achievementRouters };
