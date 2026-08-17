import type { ErrorCode } from "./types.js";

/**
 * Typed error for expected API/business failures (missing user, duplicate VAT,
 * invalid status, self-approval, and so on).
 *
 * Throw or pass with next(err) instead of writing res.status() in every handler.
 * errorHandler detects AppError, logs code + message, and responds with
 * statusCode. Unexpected throws that are not AppError become 500.
 */
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}
