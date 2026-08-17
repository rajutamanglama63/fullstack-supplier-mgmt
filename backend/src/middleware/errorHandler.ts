/**
 * Express error middleware (the 4-argument signature is required so Express
 * treats this as an error handler, not a normal route).
 *
 * AppError: expected business/API failure — log code + message, keep the
 * given HTTP status, send the generic client body.
 * Anything else: unexpected crash — log the error, respond with 500.
 * Error details never go to the frontend.
 */
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors.js";
import { sendError } from "./responseHandler.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    console.error(`[${err.statusCode}] ${err.code}: ${err.message}`);
    sendError(res, err.statusCode);
    return;
  }

  console.error(err);
  sendError(res, 500);
}
