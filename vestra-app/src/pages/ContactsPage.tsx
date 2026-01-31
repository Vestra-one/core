import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { PageContainer } from "../components/layout/PageContainer";
import { ROUTES } from "../lib/constants";

const contacts = [
  { name: "Alice Doe", address: "alice_doe.near", network: "NEAR", lastPaid: "Oct 24, 2023", amount: "4.50 NEAR" },
  { name: "Bob Smith", address: "bob_smith.near", network: "NEAR", lastPaid: "Oct 23, 2023", amount: "25.00 NEAR" },
  { name: "Carol White", address: "0x71C7...6D91", network: "Ethereum", lastPaid: "Oct 22, 2023", amount: "120.00 USDC" },
  { name: "Dev Ops", address: "dev_ops.near", network: "NEAR", lastPaid: "Oct 20, 2023", amount: "450.00 NEAR" },
  { name: "Engineering Team", address: "payroll.oct.near", network: "NEAR", lastPaid: "Oct 24, 2023", amount: "2,400.00 NEAR" },
];

export function ContactsPage() {
  return (
    <PageContainer
      breadcrumb={[
        { label: "Treasury", href: ROUTES.treasury },
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
        <Button variant="primary" leftIcon={<Icon name="add" size={20} />}>
          Add Contact
        </Button>
      </div>

        <div className="flex items-center gap-3 bg-[var(--color-surface-dark)] border border-[var(--color-border-darker)] rounded-[var(--radius-button)] px-3 py-2 w-full max-w-md shadow-[var(--shadow-card)]">
          <Icon name="search" className="text-[var(--color-text-muted)]" size={20} />
          <input
            type="text"
            placeholder="Search by name or address..."
            className="bg-transparent border-none flex-1 text-sm outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
          />
        </div>

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
                <tr
                  key={c.address}
                  className="hover:bg-[var(--color-border-darker)]/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <Icon name="person" size={22} />
                      </div>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm text-[var(--color-primary)] font-mono">
                      {c.address}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                    {c.network}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)] tabular-nums">
                    {c.lastPaid}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                        aria-label="Copy address"
                      >
                        <Icon name="content_copy" size={18} />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                        aria-label="Send payment"
                      >
                        <Icon name="send" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </PageContainer>
  );
}
