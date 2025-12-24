export function secureAction<TArgs extends unknown[], TResult>(options: {
  requireAuth?: () => Promise<void>;
  validate?: (...args: TArgs) => void;
  action: (...args: TArgs) => Promise<TResult>;
}) {
  return async (...args: TArgs): Promise<TResult> => {
    // 1️⃣ Auth
    if (options.requireAuth) {
      await options.requireAuth();
    }

    // 2️⃣ Validate
    if (options.validate) {
      options.validate(...args);
    }

    // 3️⃣ Execute action
    return options.action(...args);
  };
}
