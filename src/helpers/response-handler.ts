import { Response } from "express";
import { MetadataInterface } from "../interfaces/metadata.interface";
import { BadRequestError } from "./errors/BadRequestError";
import { isJsonString } from "./string";
import { UnauthorizedError } from "./errors/UnauthorizedError";

export class ResponseHandler {
  static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    metadata?: MetadataInterface
  ): void {
    const responsePayload: any = {
      success: true,
      message,
      data,
    };

    if (metadata) {
      responsePayload.metadata = metadata;
    }

    res.status(statusCode).json(responsePayload);
  }

  static error(
    res: Response,
    statusCode: number,
    message: string | string[]
  ): void {
    res.status(statusCode).json({
      success: false,
      message,
    });
  }

  static handleBadRequestError(res: Response, error: BadRequestError) {
    const errorMessage = isJsonString(error.message)
      ? JSON.parse(error.message)
      : error.message;
    this.error(res, 400, errorMessage);
  }

  static handleUnauthorizedError(res: Response, error: UnauthorizedError) {
    const errorMessage = isJsonString(error.message)
      ? JSON.parse(error.message)
      : error.message;
    this.error(res, 401, errorMessage);
  }

  static handleGenericError(res: Response, error: Error) {
    this.error(res, 500, error.message || "Internal Server Error");
  }

  static handleErrors(res: Response, error: Error) {
    const errorHandlers: Record<string, (res: Response, error: Error) => void> =
      {
        BadRequestError: this.handleBadRequestError.bind(
          this,
          res,
          error as BadRequestError
        ),
        ZodError: this.handleBadRequestError.bind(
          this,
          res,
          error as BadRequestError
        ),
        UnauthorizedError: this.handleUnauthorizedError.bind(
          this,
          res,
          error as UnauthorizedError
        ),
      };

    console.log(error.constructor.name);
    const errorHandler =
      errorHandlers[error.constructor.name] ||
      this.handleGenericError.bind(this, res);

    errorHandler(res, error);
  }
}
