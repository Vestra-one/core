import { describe, it, expect } from 'vitest'
import { bulkPaymentRowSchema, onboardingNotificationSchema } from './schemas'

describe('bulkPaymentRowSchema', () => {
  it('accepts valid EVM address and .near account', () => {
    expect(bulkPaymentRowSchema.parse({
      recipientName: 'Alice',
      walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      amountUsd: 100,
    })).toEqual({ recipientName: 'Alice', walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', amountUsd: 100 })
    expect(bulkPaymentRowSchema.parse({
      recipientName: 'Bob',
      walletAddress: 'alice_doe.near',
      amountUsd: 50,
    })).toEqual({ recipientName: 'Bob', walletAddress: 'alice_doe.near', amountUsd: 50 })
  })

  it('rejects invalid wallet address', () => {
    expect(() => bulkPaymentRowSchema.parse({
      recipientName: 'Bad',
      walletAddress: 'not-an-address',
      amountUsd: 10,
    })).toThrow()
    expect(() => bulkPaymentRowSchema.parse({
      recipientName: 'Bad',
      walletAddress: '0xshort',
      amountUsd: 10,
    })).toThrow()
  })

  it('rejects non-positive amount', () => {
    expect(() => bulkPaymentRowSchema.parse({
      recipientName: 'Alice',
      walletAddress: 'alice.near',
      amountUsd: 0,
    })).toThrow()
  })
})

describe('onboardingNotificationSchema', () => {
  it('accepts valid HTTPS webhook and events', () => {
    expect(onboardingNotificationSchema.parse({
      webhookUrl: 'https://api.example.com/webhooks/payflow',
      events: ['payment.completed'],
    })).toEqual({ webhookUrl: 'https://api.example.com/webhooks/payflow', events: ['payment.completed'] })
  })

  it('rejects HTTP webhook', () => {
    expect(() => onboardingNotificationSchema.parse({
      webhookUrl: 'http://api.example.com/webhook',
      events: ['payment.completed'],
    })).toThrow()
  })

  it('rejects empty events', () => {
    expect(() => onboardingNotificationSchema.parse({
      webhookUrl: 'https://api.example.com/webhook',
      events: [],
    })).toThrow()
  })
})
