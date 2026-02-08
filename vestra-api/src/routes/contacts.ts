import { Router, type Request, type Response } from "express";
import type { RequestWithAccount } from "../middleware.js";
import * as store from "../store.js";
import type { ContactCreate } from "../types.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const { accountId } = req as RequestWithAccount;
  const contacts = store.getContacts(accountId);
  res.json({ contacts });
});

router.post("/", (req: Request, res: Response) => {
  const { accountId } = req as RequestWithAccount;
  const body = req.body as ContactCreate;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const address = typeof body?.address === "string" ? body.address.trim() : "";
  const network = typeof body?.network === "string" ? body.network.trim() : "—";
  if (!address) {
    res.status(400).json({ error: "address is required" });
    return;
  }
  const contact = store.addContact(accountId, {
    name: name || `Contact ${address.slice(0, 8)}…`,
    address,
    network,
    lastPaid: body.lastPaid ?? "—",
    amount: body.amount ?? "—",
  });
  res.status(201).json(contact);
});

router.patch("/:id", (req: Request, res: Response) => {
  const { accountId } = req as RequestWithAccount;
  const { id } = req.params;
  const body = req.body as Record<string, unknown>;
  const updates: Record<string, string> = {};
  if (typeof body?.name === "string") updates.name = body.name.trim();
  if (typeof body?.address === "string") updates.address = body.address.trim();
  if (typeof body?.network === "string") updates.network = body.network.trim();
  if (typeof body?.lastPaid === "string") updates.lastPaid = body.lastPaid;
  if (typeof body?.amount === "string") updates.amount = body.amount;
  const contact = store.updateContact(accountId, id, updates);
  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }
  res.json(contact);
});

router.delete("/:id", (req: Request, res: Response) => {
  const { accountId } = req as RequestWithAccount;
  const { id } = req.params;
  const deleted = store.deleteContact(accountId, id);
  if (!deleted) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }
  res.status(204).send();
});

export default router;
