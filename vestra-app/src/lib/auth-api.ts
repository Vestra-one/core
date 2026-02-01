/**
 * Backend session contract: create and invalidate session by account.
 * Frontend calls these; backend returns a Bearer token (or sets HTTP-only cookie).
 */

import { api } from "./api";

export type CreateSessionRequest = {
  accountId: string;
};

export type CreateSessionResponse = {
  token: string;
  /** Optional; backend can include expiry for client-side display. */
  expiresAt?: string;
};

export type SignOutRequest = {
  /** Token to invalidate; backend uses it to revoke the session. */
  token: string;
};

const AUTH_SESSION_PATH = "/auth/session";
const AUTH_SIGN_OUT_PATH = "/auth/sign-out";

/**
 * Create a backend session for the given NEAR account.
 * Backend should validate the account (e.g. via signed message or RPC) and return a token.
 */
export async function createSession(
  accountId: string,
): Promise<CreateSessionResponse> {
  const body: CreateSessionRequest = { accountId };
  return api.post<CreateSessionResponse>(AUTH_SESSION_PATH, body);
}

/**
 * Invalidate the session on the backend. Call before or after wallet sign-out.
 */
export async function signOut(token: string): Promise<void> {
  await api.post<unknown>(AUTH_SIGN_OUT_PATH, { token } as SignOutRequest);
}
