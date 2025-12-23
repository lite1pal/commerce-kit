import { z } from "zod";

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
  handler,
}: {
  formData: FormData;
  schema: z.ZodSchema<TInput>;

  handler: (input: TInput) => Promise<TOutput>;
}): Promise<ActionResult<TOutput>> {
  try {
    const parsed = schema.parse(Object.fromEntries(formData.entries()));

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

export const initialAuthState = createInitialState<{ userId: string }>();
