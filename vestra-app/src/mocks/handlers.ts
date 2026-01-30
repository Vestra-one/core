import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/treasury/balance', () => {
    return HttpResponse.json({
      amount: '1240.50',
      currency: 'NEAR',
      usdEquivalent: '8642.00',
    })
  }),

  http.get('/activities/recent', () => {
    return HttpResponse.json({
      activities: [
        {
          id: 'pay-1',
          type: 'payroll',
          title: 'Payroll - Oct 2023',
          recipientCount: 100,
          amount: '450.00 NEAR',
          usdEquivalent: '3150.00',
          status: 'processing',
          date: '2023-10-24T14:20:05Z',
        },
        {
          id: 'pay-2',
          type: 'transfer',
          title: 'Transfer to Contractor',
          recipient: 'dev_ops.near',
          amount: '25.00 NEAR',
          usdEquivalent: '175.00',
          status: 'completed',
          date: '2023-10-23T09:15:00Z',
        },
      ],
    })
  }),
]
