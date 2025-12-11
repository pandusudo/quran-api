import { Router } from "express";
import { ValidateMiddleware } from "../middlewares/validate.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { BookmarkCreateDTO } from "../dtos/bookmark/create-bookmark";
import { BookmarkController } from "../controllers/bookmark.controller";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ValidateMiddleware.validateData(BookmarkCreateDTO),
  BookmarkController.createBookmark
);
router.get(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  BookmarkController.getMyBookmarks
);
router.get(
  "/page/:pageId",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  BookmarkController.getBookmarkByPageId
);
router.delete(
  "/:bookmarkId",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  BookmarkController.deleteBookmark
);

export { router as bookmarkRouters };
