import { Router } from "express";
import { VerseController } from "../controllers/verse.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.get(
  "/page/:pageNumber",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  VerseController.getVersesByPageNumber
);

export { router as verseRouters };
