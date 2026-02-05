import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { BatchManualEntry } from "../components/payments/BatchManualEntry";
import { ROUTES } from "../lib/constants";

const parsedRows = [
  { row: 1, name: "Decentral Inc.", address: "0x71C...3921", amount: "$12,400.00", status: "Validated" as const },
  { row: 2, name: "Future Nodes", address: "0x3A2...910F", amount: "$8,250.00", status: "Validated" as const },
  { row: 3, name: "Invalid Recipient", address: "0xINVALID_ADDR", amount: "$450.00", status: "Malformed Address" as const, error: true },
  { row: 4, name: "Ether Services", address: "0x9B1...22EE", amount: "$21,400.00", status: "Validated" as const },
];

type BulkTab = "manual" | "csv";

export function PaymentsBulkPage() {
  const [tab, setTab] = useState<BulkTab>("manual");

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-[var(--color-text-primary)]">
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-8 min-h-0 overflow-auto">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Payments", href: ROUTES.paymentsManual },
              { label: "Bulk Upload" },
            ]}
          />
          <h1 className="text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] mt-1">
            Bulk Upload
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1 font-medium">
            Pay multiple recipients via manual entry or CSV upload
          </p>
        </div>
        <div className="mb-6 border-b border-[var(--color-border-dark)] flex gap-8">
          <button
            type="button"
            onClick={() => setTab("manual")}
            className={`flex flex-col items-center border-b-2 pb-3 -mb-px transition-all ${
              tab === "manual"
                ? "border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span className="text-sm font-bold tracking-tight">Manual Entry</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("csv")}
            className={`flex flex-col items-center border-b-2 pb-3 -mb-px transition-all ${
              tab === "csv"
                ? "border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span className="text-sm font-bold tracking-tight">CSV Upload</span>
          </button>
        </div>

        {tab === "manual" ? (
          <BatchManualEntry />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-[var(--color-border-darker)]">
                  <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-6 py-12 cursor-pointer hover:border-[var(--color-primary)]/50 group">
                    <div className="size-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                      <Icon name="upload_file" size={32} />
                    </div>
                    <div className="text-center max-w-[420px]">
                      <p className="text-lg font-bold">Select CSV to upload</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Drag and drop your file here or click to browse. Ensure your CSV follows the standard Vestra template.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" leftIcon={<Icon name="add" size={20} />}>Browse Files</Button>
                      <Button variant="secondary" size="sm">Download Template</Button>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="data_table" className="text-[var(--color-primary)]" size={24} />
                    <h3 className="font-bold text-[var(--color-text-primary)]">Preview Parsed Rows (152)</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">1 Error detected</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-surface-dark)] border-y border-[var(--color-border-darker)]">
                        {["Row", "Recipient Name", "Wallet Address", "Amount (USD)", "Status", "Action"].map((h) => (
                          <th key={h} scope="col" className="px-6 py-3 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-darker)]">
                      {parsedRows.map((r) => (
                        <tr
                          key={r.row}
                          className={r.error ? "bg-red-950/20 border-l-4 border-red-500" : "hover:bg-white/5 transition-colors"}
                        >
                          <td className={`px-6 py-4 text-sm ${r.error ? "text-red-400 font-bold" : "text-[var(--color-text-secondary)]"}`}>{r.row}</td>
                          <td className={`px-6 py-4 text-sm font-semibold ${r.error ? "text-red-400" : "text-[var(--color-text-primary)]"}`}>{r.name}</td>
                          <td className={`px-6 py-4 text-sm font-mono ${r.error ? "text-red-500" : "text-[var(--color-text-muted)]"}`}>{r.address}</td>
                          <td className={`px-6 py-4 text-sm font-bold ${r.error ? "text-red-300" : "text-[var(--color-text-primary)]"}`}>{r.amount}</td>
                          <td className="px-6 py-4">
                            {r.error ? (
                              <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                                <Icon name="warning" size={18} /> {r.status}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs font-medium text-green-500">
                                <span className="size-1.5 rounded-full bg-green-500" /> Validated
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button type="button" aria-label={`Edit row ${r.row}`} className="material-symbols-outlined cursor-pointer hover:text-[var(--color-primary)] text-[var(--color-text-muted)]">
                              edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-[var(--color-surface-dark)] rounded-xl border border-[var(--color-border-darker)] p-5">
                <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-4">Batch Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--color-text-muted)]">Total Rows</span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">152</span>
                  </div>
                  <div className="flex justify-between items-center text-red-500">
                    <span className="text-sm font-medium">Validation Errors</span>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--color-text-muted)]">Network Fees (Est.)</span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">$18.42</span>
                  </div>
                  <div className="border-t border-[var(--color-border-darker)] pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Total Amount</span>
                      <span className="text-lg font-black text-[var(--color-primary)]">$42,500.00</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)] text-right italic">Balance after: $104,231.50</p>
                  </div>
                  <Button disabled className="w-full py-3" leftIcon={<Icon name="check_circle" size={20} />}>
                    Fix Errors to Continue
                  </Button>
                </div>
              </div>
              <div className="mt-6 bg-[var(--color-border-darker)]/30 rounded-xl p-5 border border-[var(--color-border-darker)]">
                <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Icon name="help_outline" size={18} /> Instructions
                </h4>
                <ul className="text-xs text-[var(--color-text-muted)] flex flex-col gap-2 leading-relaxed">
                  <li>• First column must be &quot;Recipient Name&quot;.</li>
                  <li>• Wallet addresses must be EVM compatible.</li>
                  <li>• Maximum 500 rows per batch.</li>
                  <li>• Amount should be in USD.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
        {tab === "manual" && (
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-8">
            Sending a single payment?{" "}
            <Link to={ROUTES.paymentsManual} className="text-[var(--color-primary)] hover:underline">
              Use New Payment
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
