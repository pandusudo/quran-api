import { Router } from "express";
import { ChapterController } from "../controllers/chapter.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.get(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ChapterController.getChapters
);
router.get(
  "/:id",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ChapterController.getChapterById
);

export { router as chapterRouters };
