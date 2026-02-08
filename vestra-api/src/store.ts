/**
 * In-memory store: sessions (token → account), contacts and preferences by account ID.
 * Account-scoped data is only accessible with a valid session token.
 */

import type { Contact, ContactCreate, AccountPreferences } from "./types.js";

export type Session = { accountId: string; expiresAt?: number };

const sessionsByToken = new Map<string, Session>();
const contactsByAccount = new Map<string, Contact[]>();
const preferencesByAccount = new Map<string, AccountPreferences>();

function nextId(): string {
  return crypto.randomUUID();
}

/** Create a session for the given account; returns the token. */
export function createSession(accountId: string, ttlMs = 24 * 60 * 60 * 1000): string {
  const token = nextId();
  const expiresAt = Date.now() + ttlMs;
  sessionsByToken.set(token, { accountId, expiresAt });
  return token;
}

/** Invalidate a session by token. */
export function deleteSession(token: string): boolean {
  return sessionsByToken.delete(token);
}

/** Resolve token to accountId; returns null if missing or expired. */
export function getAccountIdByToken(token: string): string | null {
  const session = sessionsByToken.get(token);
  if (!session) return null;
  if (session.expiresAt != null && session.expiresAt < Date.now()) {
    sessionsByToken.delete(token);
    return null;
  }
  return session.accountId;
}

export function getContacts(accountId: string): Contact[] {
  return contactsByAccount.get(accountId) ?? [];
}

export function addContact(accountId: string, data: ContactCreate): Contact {
  const list = contactsByAccount.get(accountId) ?? [];
  const contact: Contact = {
    id: nextId(),
    name: data.name,
    address: data.address,
    network: data.network,
    lastPaid: data.lastPaid ?? "—",
    amount: data.amount ?? "—",
  };
  list.push(contact);
  contactsByAccount.set(accountId, list);
  return contact;
}

export function updateContact(
  accountId: string,
  contactId: string,
  data: Partial<Contact>
): Contact | null {
  const list = contactsByAccount.get(accountId) ?? [];
  const index = list.findIndex((c) => c.id === contactId);
  if (index === -1) return null;
  const updated = { ...list[index], ...data };
  list[index] = updated;
  return updated;
}

export function deleteContact(accountId: string, contactId: string): boolean {
  const list = contactsByAccount.get(accountId) ?? [];
  const index = list.findIndex((c) => c.id === contactId);
  if (index === -1) return false;
  list.splice(index, 1);
  return true;
}

export function getPreferences(accountId: string): AccountPreferences {
  return preferencesByAccount.get(accountId) ?? {};
}

export function setPreferences(
  accountId: string,
  data: Partial<AccountPreferences>
): AccountPreferences {
  const current = preferencesByAccount.get(accountId) ?? {};
  const next = { ...current, ...data };
  preferencesByAccount.set(accountId, next);
  return next;
}
