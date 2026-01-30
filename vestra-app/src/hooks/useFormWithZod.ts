import { useForm, type UseFormProps, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

/**
 * Thin wrapper around useForm + zodResolver for type-safe forms.
 * Usage: useFormWithZod(someZodSchema, { defaultValues: { ... } })
 */
export function useFormWithZod<Schema extends z.ZodType>(
  schema: Schema,
  options?: Omit<UseFormProps<z.infer<Schema>>, 'resolver'>,
): UseFormReturn<z.infer<Schema>> {
  return useForm<z.infer<Schema>>({
    ...options,
    resolver: zodResolver(schema),
  })
}
