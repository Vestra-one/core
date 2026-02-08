/**
 * Shared types for contacts and account preferences.
 */

export type Contact = {
  id: string;
  name: string;
  address: string;
  network: string;
  lastPaid?: string;
  amount?: string;
};

export type ContactCreate = Omit<Contact, "id"> & Partial<Pick<Contact, "lastPaid" | "amount">>;
export type ContactUpdate = Partial<Pick<Contact, "name" | "address" | "network" | "lastPaid" | "amount">>;

export type AccountPreferences = {
  email?: string;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  smsCountryCode?: string;
  smsNumber?: string;
  webhookUrl?: string;
};
