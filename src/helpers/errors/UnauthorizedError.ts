import { ValidationError } from "class-validator";

export class UnauthorizedError extends Error {
  constructor(message: string | ValidationError[]) {
    super(typeof message === "string" ? message : JSON.stringify(message));

    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
