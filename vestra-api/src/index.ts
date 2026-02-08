/**
 * Vestra API: session (auth) + contacts and preferences.
 * Account-scoped routes require a valid Bearer token; accountId is taken from the session, not from headers.
 */

import express from "express";
import cors from "cors";
import { requireAuth } from "./middleware.js";
import authRouter from "./routes/auth.js";
import contactsRouter from "./routes/contacts.js";
import preferencesRouter from "./routes/preferences.js";

const PORT = Number(process.env.PORT) || 3032;

const app = express();
app.use(cors());
app.use(express.json());

// Auth: create and invalidate session (no auth required)
app.use("/auth", authRouter);

// Account-scoped routes: require valid session token; accountId from token only
app.use("/accounts/me/contacts", requireAuth, contactsRouter);
app.use("/accounts/me/preferences", requireAuth, preferencesRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Vestra API listening on http://0.0.0.0:${PORT}`);
});
