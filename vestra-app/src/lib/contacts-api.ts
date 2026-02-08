/**
 * API client for account contacts (vestra-api).
 * Use with useApi() so X-Account-Id and token are sent.
 */

import type { Api } from "./api";

export type Contact = {
  id: string;
  name: string;
  address: string;
  network: string;
  lastPaid?: string;
  amount?: string;
};

export type ContactCreate = {
  name?: string;
  address: string;
  network: string;
  lastPaid?: string;
  amount?: string;
};

export type ContactUpdate = Partial<Pick<Contact, "name" | "address" | "network" | "lastPaid" | "amount">>;

const CONTACTS_PATH = "/accounts/me/contacts";

export async function getContacts(api: Api): Promise<Contact[]> {
  const res = await api.get<{ contacts: Contact[] }>(CONTACTS_PATH);
  return res.contacts;
}

export async function createContact(api: Api, data: ContactCreate): Promise<Contact> {
  return api.post<Contact>(CONTACTS_PATH, data);
}

export async function updateContact(api: Api, id: string, data: ContactUpdate): Promise<Contact> {
  return api.patch<Contact>(`${CONTACTS_PATH}/${id}`, data);
}

export async function deleteContact(api: Api, id: string): Promise<void> {
  await api.delete(`${CONTACTS_PATH}/${id}`);
}
