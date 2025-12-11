import { NextFunction, Request, Response } from "express";
import { checkSession } from "../lib/auth";
import { UnauthorizedError } from "../helpers/errors/UnauthorizedError";
import { ResponseHandler } from "../helpers/response-handler";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export class AuthMiddleware {
  static async checkAuthenticated(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const session = await checkSession(req.headers);

      if (!session) throw new UnauthorizedError("You are not authorized");

      req.user = session?.user || null;
      next();
    } catch (error: Error | any) {
      ResponseHandler.handleErrors(res, error);
    }
  }
}
