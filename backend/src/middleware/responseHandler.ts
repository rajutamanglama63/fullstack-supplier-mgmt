import type { NextFunction, Request, Response } from "express";

export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again later.";

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  message = "Success",
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res: Response, statusCode = 500): Response {
  return res.status(statusCode).json({
    success: false,
    message: GENERIC_ERROR_MESSAGE,
  });
}

export function responseHandler(_req: Request, res: Response, next: NextFunction): void {
  res.success = (data, message = "Success", statusCode = 200) =>
    sendSuccess(res, data, statusCode, message);

  res.fail = (statusCode = 500) => sendError(res, statusCode);

  next();
}
