import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

export type ActionResult<TData> =
  | { ok: true; data: TData }
  | {
      ok: false;
      formErrors?: string[];
      fieldErrors?: Record<string, string[]>;
    };

export class ActionError extends Error {
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export function createInitialState<TData>(): ActionResult<TData> {
  return { ok: false, formErrors: [], fieldErrors: {} };
}

export async function withValidatedAction<TInput, TOutput>({
  formData,
  schema,
  rateLimit: rateLimitConfig,
  handler,
}: {
  formData: FormData;
  schema: z.ZodSchema<TInput>;
  rateLimit?: {
    key: (input: TInput) => string;
    window?: number;
    max?: number;
  };
  handler: (input: TInput) => Promise<TOutput>;
}): Promise<ActionResult<TOutput>> {
  try {
    const parsed = schema.parse(Object.fromEntries(formData.entries()));

    if (rateLimitConfig) {
      const key = rateLimitConfig.key(parsed);
      const window = rateLimitConfig.window ?? 60;
      const max = rateLimitConfig.max ?? 5;

      const limit = await rateLimit({ key, window, max });
      if (!limit.allowed) {
        return {
          ok: false,
          formErrors: [`Too many attempts. Try again in ${limit.reset}s.`],
        };
      }
    }

    const data = await handler(parsed);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const flattened = err.flatten();
      return {
        ok: false,
        formErrors: flattened.formErrors,
        fieldErrors: flattened.fieldErrors,
      };
    }

    if (err instanceof ActionError) {
      return {
        ok: false,
        formErrors: [err.message],
        fieldErrors: err.fieldErrors,
      };
    }

    console.error("[action]", err);
    return {
      ok: false,
      formErrors: ["Something went wrong. Please try again."],
    };
  }
}
