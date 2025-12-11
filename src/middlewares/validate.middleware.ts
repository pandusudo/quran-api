import * as z from "zod";
import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";

export class ValidateMiddleware {
  static validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error: Error | any) {
        console.error(error);
        ResponseHandler.handleErrors(res, error);
      }
    };
  }
}
