import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { PageContainer } from "../components/layout/PageContainer";
import { ROUTES } from "../lib/constants";
import { CHAIN_LABELS } from "../hooks/useSupportedTokens";
import { useApi } from "../hooks/useApi";
import {
  getContacts,
  createContact,
  deleteContact,
  type Contact,
} from "../lib/contacts-api";

export function ContactsPage() {
  const api = useApi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newContactName, setNewContactName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [manualNetwork, setManualNetwork] = useState("NEAR");

  const addAddress = searchParams.get("add");
  const addChain = searchParams.get("chain");
  const networkLabel = addChain ? (CHAIN_LABELS[addChain] ?? addChain) : "—";
  const networkOptions = Object.entries(CHAIN_LABELS).map(([id, label]) => ({ id, label }));

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getContacts(api);
      setContacts(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const clearAddParams = () => {
    setSearchParams({}, { replace: true });
    setNewContactName("");
  };

  const handleSaveFromPayment = async () => {
    if (!addAddress?.trim() || saving) return;
    setSaving(true);
    try {
      const name = newContactName.trim() || `Contact ${addAddress.slice(0, 8)}…`;
      const created = await createContact(api, {
        name,
        address: addAddress.trim(),
        network: networkLabel,
        lastPaid: "—",
        amount: "—",
      });
      setContacts((prev) => [...prev, created]);
      clearAddParams();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await deleteContact(api, id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddContact = async () => {
    const address = manualAddress.trim();
    if (!address || saving) return;
    setSaving(true);
    try {
      const name = manualName.trim() || `Contact ${address.slice(0, 8)}…`;
      const created = await createContact(api, {
        name,
        address,
        network: manualNetwork,
        lastPaid: "—",
        amount: "—",
      });
      setContacts((prev) => [...prev, created]);
      setShowAddForm(false);
      setManualName("");
      setManualAddress("");
      setManualNetwork("NEAR");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add contact");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      breadcrumb={[
        { label: "Payments", href: ROUTES.paymentsManual },
        { label: "Contacts" },
      ]}
      spacing="space-y-6"
    >
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Contacts
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage payees and your address book for quick payments.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="add" size={20} />}
          onClick={() => setShowAddForm((v) => !v)}
        >
          Add Contact
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-xl p-5 flex flex-wrap gap-4 items-end">
          <p className="text-sm font-medium text-[var(--color-text-primary)] w-full">
            New contact
          </p>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Name
            </label>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="e.g. Vendor or recipient"
              className="px-3 py-2 rounded-[var(--radius-button)] bg-[var(--color-background-darker)] border border-[var(--color-border-darker)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-48"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Address / wallet
            </label>
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="e.g. alice.near or 0x..."
              className="w-full px-3 py-2 rounded-[var(--radius-button)] bg-[var(--color-background-darker)] border border-[var(--color-border-darker)] text-sm font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Network
            </label>
            <select
              value={manualNetwork}
              onChange={(e) => setManualNetwork(e.target.value)}
              className="px-3 py-2 rounded-[var(--radius-button)] bg-[var(--color-background-darker)] border border-[var(--color-border-darker)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {networkOptions.map(({ id, label }) => (
                <option key={id} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="primary"
            leftIcon={<Icon name="person_add" size={18} />}
            onClick={handleAddContact}
            disabled={saving || !manualAddress.trim()}
          >
            {saving ? "Saving…" : "Add"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)} disabled={saving}>
            Cancel
          </Button>
        </div>
      )}

      {error && (
        <div className="rounded-[var(--radius-button)] bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {addAddress && (
        <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl p-5 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Save this address from your last payment
            </p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono break-all mb-2">
              {addAddress}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">Network: {networkLabel}</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                Contact name
              </label>
              <input
                type="text"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="e.g. Vendor name"
                className="px-3 py-2 rounded-[var(--radius-button)] bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-48"
              />
            </div>
            <Button
              onClick={handleSaveFromPayment}
              leftIcon={<Icon name="person_add" size={18} />}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save to contacts"}
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAddParams} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-[var(--radius-button)] px-3 py-2 w-full max-w-md shadow-[var(--shadow-card)]">
        <Icon name="search" className="text-[var(--color-text-muted)]" size={20} />
        <input
          type="text"
          placeholder="Search by name or address..."
          className="bg-transparent border-none flex-1 text-sm outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
        />
      </div>

      {loading ? (
        <p className="text-[var(--color-text-muted)] text-sm">Loading contacts…</p>
      ) : (
        <div className="bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--color-background-darker)]/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                  Address / Wallet
                </th>
                <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                  Network
                </th>
                <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider">
                  Last paid
                </th>
                <th scope="col" className="px-6 py-4 text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-darker)]">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--color-border-darker)]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <Icon name="person" size={22} />
                      </div>
                      <span className="font-semibold text-[var(--color-text-primary)]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm text-[var(--color-primary)] font-mono">{c.address}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{c.network}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)] tabular-nums">{c.lastPaid ?? "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                        aria-label="Copy address"
                      >
                        <Icon name="content_copy" size={18} />
                      </button>
                      <Link
                        to={`${ROUTES.paymentsManual}?recipient=${encodeURIComponent(c.address)}`}
                        className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors inline-flex"
                        aria-label="Send payment"
                      >
                        <Icon name="send" size={18} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        aria-label="Delete contact"
                      >
                        <Icon name="delete" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && !loading && (
            <p className="px-6 py-8 text-center text-[var(--color-text-muted)] text-sm">
              No contacts yet. Add one from a payment or use Add Contact.
            </p>
          )}
        </div>
      )}
    </PageContainer>
  );
}
