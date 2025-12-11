import { Router } from "express";
import { ValidateMiddleware } from "../middlewares/validate.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { HistoryCreateDTO } from "../dtos/history/create-reading-history";
import { HistoryController } from "../controllers/history.controller";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ValidateMiddleware.validateData(HistoryCreateDTO),
  HistoryController.createHistory
);

export { router as historyRouters };
