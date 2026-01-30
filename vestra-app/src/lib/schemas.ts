import { z } from 'zod'

/** Shared Zod schemas for forms. Use with React Hook Form via @hookform/resolvers/zod. */

export const webhookUrlSchema = z
  .string()
  .url('Enter a valid URL')
  .refine((url) => url.startsWith('https://'), 'Webhook URL must use HTTPS')

export const onboardingNotificationSchema = z.object({
  webhookUrl: webhookUrlSchema,
  events: z.array(z.string()).min(1, 'Select at least one event'),
})

export const bulkPaymentRowSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  walletAddress: z
    .string()
    .min(1, 'Wallet address is required')
    .regex(/^(0x[a-fA-F0-9]{40}|[a-zA-Z0-9_.-]+\.near)$/, 'Invalid EVM address or .near account'),
  amountUsd: z.coerce.number().positive('Amount must be positive'),
})

export const bulkPaymentFileSchema = z.object({
  rows: z.array(bulkPaymentRowSchema),
})

export type OnboardingNotificationForm = z.infer<typeof onboardingNotificationSchema>
export type BulkPaymentRow = z.infer<typeof bulkPaymentRowSchema>
