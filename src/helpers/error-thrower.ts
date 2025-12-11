import { BadRequestError } from "./errors/BadRequestError";
import { UnauthorizedError } from "./errors/UnauthorizedError";
// import { ForbiddenAccessError } from './errors/ForbiddenAccessError';
// import { NotFoundError } from './errors/NotFoundError';
// import { TooManyRequestsError } from './errors/TooManyRequestsError';
// import { UnauthorizedError } from './errors/UnauthorizedError';

export function throwError(error: Error, serviceName: string) {
  if (
    // error instanceof NotFoundError ||
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError
    // ||
    // error instanceof ForbiddenAccessError ||
    // error instanceof TooManyRequestsError
  ) {
    throw error;
  } else {
    throw new Error(`Something went wrong in the ${serviceName} service`);
  }
}
