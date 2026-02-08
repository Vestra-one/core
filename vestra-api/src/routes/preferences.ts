import { Router, type Request, type Response } from "express";
import type { RequestWithAccount } from "../middleware.js";
import * as store from "../store.js";
import type { AccountPreferences } from "../types.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const { accountId } = req as RequestWithAccount;
  const preferences = store.getPreferences(accountId);
  res.json(preferences);
});

router.patch("/", (req: Request, res: Response) => {
  const { accountId } = req as RequestWithAccount;
  const body = req.body as Record<string, unknown>;
  const updates: Partial<AccountPreferences> = {};
  if (typeof body?.email === "string") updates.email = body.email.trim() || undefined;
  if (typeof body?.emailEnabled === "boolean") updates.emailEnabled = body.emailEnabled;
  if (typeof body?.smsEnabled === "boolean") updates.smsEnabled = body.smsEnabled;
  if (typeof body?.smsCountryCode === "string") updates.smsCountryCode = body.smsCountryCode.trim() || undefined;
  if (typeof body?.smsNumber === "string") updates.smsNumber = body.smsNumber.trim() || undefined;
  if (typeof body?.webhookUrl === "string") updates.webhookUrl = body.webhookUrl.trim() || undefined;
  const preferences = store.setPreferences(accountId, updates);
  res.json(preferences);
});

export default router;
