import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { DashboardController } from "../controllers/dashboard.controller";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.get(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  DashboardController.getDashboardData
);

export { router as dashboardRouters };
