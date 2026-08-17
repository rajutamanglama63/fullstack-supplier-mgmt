/**
 * Type-only file (nothing here runs at runtime).
 *
 * Express ships its own Request/Response types. We merge extra fields into
 * those interfaces so TypeScript knows about what middleware attaches:
 * - req.currentUser from currentUser middleware
 * - res.success() / res.fail() from responseHandler
 *
 * Without this, those properties would be type errors even though they exist
 * at runtime. export {} makes this a module so `declare global` actually merges
 * into Express instead of creating a separate namespace.
 */
import type { User } from "../types.js";

declare global {
  namespace Express {
    interface Request {
      currentUser: User;
    }

    interface Response {
      success: <T>(data?: T, message?: string, statusCode?: number) => this;
      fail: (statusCode?: number) => this;
    }
  }
}

export { };
