import { Router, type Request, type Response } from "express";
import * as store from "../store.js";

const router = Router();

/**
 * Create a session for the given NEAR account.
 * In production you would verify the account (e.g. signed message) before issuing a token.
 * Returns a token; the client sends it as Authorization: Bearer <token> on subsequent requests.
 */
router.post("/session", (req: Request, res: Response) => {
  const body = req.body as { accountId?: string };
  const accountId = typeof body?.accountId === "string" ? body.accountId.trim() : "";
  if (!accountId) {
    res.status(400).json({ error: "accountId required" });
    return;
  }
  const token = store.createSession(accountId);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  res.status(201).json({ token, expiresAt });
});

/**
 * Invalidate the session. Call with the token in the body (frontend sends it when signing out).
 */
router.post("/sign-out", (req: Request, res: Response) => {
  const body = req.body as { token?: string };
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  if (token) store.deleteSession(token);
  res.status(204).send();
});

export default router;
