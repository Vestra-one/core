/**
 * API client for account preferences (vestra-api).
 * Use with useApi() so X-Account-Id and token are sent.
 */

import type { Api } from "./api";

export type AccountPreferences = {
  email?: string;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  smsCountryCode?: string;
  smsNumber?: string;
  webhookUrl?: string;
};

const PREFERENCES_PATH = "/accounts/me/preferences";

export async function getPreferences(api: Api): Promise<AccountPreferences> {
  return api.get<AccountPreferences>(PREFERENCES_PATH);
}

export async function updatePreferences(
  api: Api,
  data: Partial<AccountPreferences>
): Promise<AccountPreferences> {
  return api.patch<AccountPreferences>(PREFERENCES_PATH, data);
}
