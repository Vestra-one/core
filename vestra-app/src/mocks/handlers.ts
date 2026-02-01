import { http, HttpResponse } from "msw";

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
];
