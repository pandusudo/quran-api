import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { ValidateMiddleware } from "../middlewares/validate.middleware";
import { NoteCreateDTO } from "../dtos/note/create-note";
import { NoteUpdateDTO } from "../dtos/note/update-note";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ValidateMiddleware.validateData(NoteCreateDTO),
  NoteController.createNote
);
router.put(
  "/:noteId",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ValidateMiddleware.validateData(NoteUpdateDTO),
  NoteController.updateNote
);
router.get(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  NoteController.getMyNotes
);
router.get(
  "/page/:pageId",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  NoteController.getNotesByPageId
);

export { router as noteRouters };
