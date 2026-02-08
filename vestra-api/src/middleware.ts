import type { Request, Response, NextFunction } from "express";
import { getAccountIdByToken } from "./store.js";

export type RequestWithAccount = Request & { accountId: string };

/**
 * Requires a valid session: Authorization: Bearer <token>.
 * Resolves the token to accountId from the session store (never from a client-supplied header).
 * Only the account that created the session can access their data.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth = req.header("Authorization");
  const token =
    auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  if (!token) {
    res.status(401).json({ error: "Authorization: Bearer <token> required" });
    return;
  }
  const accountId = getAccountIdByToken(token);
  if (!accountId) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  (req as RequestWithAccount).accountId = accountId;
  next();
}
