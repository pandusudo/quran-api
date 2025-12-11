import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ValidateMiddleware } from "../middlewares/validate.middleware";
import {
  ProfileUpdateDTO,
  ProfileUpdateEmailDTO,
} from "../dtos/profile/update-profile";
import { ResendVerificationDTO } from "../dtos/profile/resend-verification";
import rateLimitMiddleware from "../middlewares/rate-limit.middleware";

const router = Router();

router.get(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ProfileController.getProfile
);
router.put(
  "/",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ValidateMiddleware.validateData(ProfileUpdateDTO),
  ProfileController.updateProfile
);
router.put(
  "/email",
  rateLimitMiddleware,
  AuthMiddleware.checkAuthenticated,
  ValidateMiddleware.validateData(ProfileUpdateEmailDTO),
  ProfileController.updateProfileEmail
);
router.post(
  "/resend-verification",
  rateLimitMiddleware,
  ValidateMiddleware.validateData(ResendVerificationDTO),
  ProfileController.resendVerificationEmail
);

export { router as profileRouters };
