import type { Request, Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";
import { ProfileService } from "../services/profile.service";

export class ProfileController {
  static async updateProfile(req: Request, res: Response) {
    try {
      const user = await ProfileService.updateProfileName(
        req.body,
        req.headers as HeadersInit
      );
      ResponseHandler.success(res, 200, "Profile updated successfully", user);
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async updateProfileEmail(req: Request, res: Response) {
    try {
      const user = await ProfileService.updateProfileEmail(
        req.body,
        req.headers as HeadersInit
      );
      ResponseHandler.success(res, 200, "Email updated successfully", user);
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const user = await ProfileService.getProfile(req.headers);

      ResponseHandler.success(res, 200, "Profile fetched successfully", user);
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async resendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await ProfileService.resendVerificationEmail(email);

      ResponseHandler.success(
        res,
        200,
        "Verification email sent successfully",
        result
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
