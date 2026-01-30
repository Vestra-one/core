import {
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

/** Form values compatible with React Hook Form (record type). */
type FieldValuesLike = Record<string, unknown>;

/**
 * Thin wrapper around useForm + zodResolver for type-safe forms.
 * Usage: useFormWithZod(someZodSchema, { defaultValues: { ... } })
 * Note: zodResolver is typed for Zod 3; we use assertions for Zod 4 compatibility.
 */
export function useFormWithZod<Schema extends z.ZodType<FieldValuesLike>>(
  schema: Schema,
  options?: Omit<UseFormProps<z.infer<Schema>>, "resolver">,
): UseFormReturn<z.infer<Schema>> {
  /* eslint-disable @typescript-eslint/no-explicit-any -- zodResolver is Zod 3 typed; assertions for Zod 4 */
  const form = useForm({
    ...options,
    resolver: zodResolver(schema as any),
  } as any);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return form as unknown as UseFormReturn<z.infer<Schema>>;
}
