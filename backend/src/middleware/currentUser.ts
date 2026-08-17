import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors.js";
import { getUserById } from "../users.js";

export function currentUser(req: Request, _res: Response, next: NextFunction): void {
  const userId = req.header("X-User-Id")?.trim();

  if (!userId) {
    next(new AppError("UNAUTHORIZED", "X-User-Id header is required.", 401));
    return;
  }

  const user = getUserById(userId);

  if (!user) {
    next(new AppError("UNAUTHORIZED", `Unknown user: ${userId}`, 401));
    return;
  }

  req.currentUser = user;
  next();
}
