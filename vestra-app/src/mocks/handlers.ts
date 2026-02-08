import { http, HttpResponse } from "msw";

// In-memory store for MSW: keyed by X-Account-Id (session left as-is)
const contactsByAccount = new Map<string, Array<{ id: string; name: string; address: string; network: string; lastPaid?: string; amount?: string }>>();
const preferencesByAccount = new Map<string, Record<string, unknown>>();

function nextId() {
  return crypto.randomUUID();
}

export const handlers = [
  http.post("/auth/session", async ({ request }) => {
    const body = (await request.json()) as { accountId?: string };
    const accountId = body?.accountId;
    if (!accountId || typeof accountId !== "string") {
      return HttpResponse.json(
        { error: "accountId required" },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      token: `mock-token-${accountId}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }),

  http.post("/auth/sign-out", async ({ request }) => {
    await request.json();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/treasury/balance", () => {
    return HttpResponse.json({
      amount: "1240.50",
      currency: "NEAR",
      usdEquivalent: "8642.00",
    });
  }),

  http.get("/activities/recent", () => {
    return HttpResponse.json({
      activities: [
        {
          id: "pay-1",
          type: "payroll",
          title: "Payroll - Oct 2023",
          recipientCount: 100,
          amount: "450.00 NEAR",
          usdEquivalent: "3150.00",
          status: "processing",
          date: "2023-10-24T14:20:05Z",
        },
        {
          id: "pay-2",
          type: "transfer",
          title: "Transfer to Contractor",
          recipient: "dev_ops.near",
          amount: "25.00 NEAR",
          usdEquivalent: "175.00",
          status: "completed",
          date: "2023-10-23T09:15:00Z",
        },
      ],
    });
  }),

  http.get("/accounts/me/contacts", ({ request }) => {
    const accountId = request.headers.get("X-Account-Id") ?? "";
    const contacts = contactsByAccount.get(accountId) ?? [];
    return HttpResponse.json({ contacts });
  }),
  http.post("/accounts/me/contacts", async ({ request }) => {
    const accountId = request.headers.get("X-Account-Id") ?? "";
    const body = (await request.json()) as { name?: string; address: string; network?: string; lastPaid?: string; amount?: string };
    const list = contactsByAccount.get(accountId) ?? [];
    const contact = {
      id: nextId(),
      name: (body.name?.trim() || `Contact ${(body.address ?? "").slice(0, 8)}…`) as string,
      address: (body.address ?? "").trim(),
      network: (body.network ?? "—").trim(),
      lastPaid: body.lastPaid ?? "—",
      amount: body.amount ?? "—",
    };
    list.push(contact);
    contactsByAccount.set(accountId, list);
    return HttpResponse.json(contact, { status: 201 });
  }),
  http.patch("/accounts/me/contacts/:id", async ({ request, params }) => {
    const accountId = request.headers.get("X-Account-Id") ?? "";
    const id = params.id as string;
    const body = (await request.json()) as Record<string, unknown>;
    const list = contactsByAccount.get(accountId) ?? [];
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return HttpResponse.json({ error: "Contact not found" }, { status: 404 });
    const prev = list[index];
    const updated = { ...prev, ...body, id: prev.id };
    list[index] = updated;
    return HttpResponse.json(updated);
  }),
  http.delete("/accounts/me/contacts/:id", ({ request, params }) => {
    const accountId = request.headers.get("X-Account-Id") ?? "";
    const id = params.id as string;
    const list = contactsByAccount.get(accountId) ?? [];
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return HttpResponse.json({ error: "Contact not found" }, { status: 404 });
    list.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/accounts/me/preferences", ({ request }) => {
    const accountId = request.headers.get("X-Account-Id") ?? "";
    const prefs = preferencesByAccount.get(accountId) ?? {};
    return HttpResponse.json(prefs);
  }),
  http.patch("/accounts/me/preferences", async ({ request }) => {
    const accountId = request.headers.get("X-Account-Id") ?? "";
    const body = (await request.json()) as Record<string, unknown>;
    const current = preferencesByAccount.get(accountId) ?? {};
    const next = { ...current, ...body };
    preferencesByAccount.set(accountId, next);
    return HttpResponse.json(next);
  }),
];
