"use client";

export function StarRating({
  name,
  label = "",
  defaultValue = 5,
  max = 5,
  className = "",
}: {
  name: string;
  label?: string;
  defaultValue?: number;
  max?: number;
  className?: string;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number>(defaultValue);

  // Remove flicker by only updating hovered on mouse move, and clearing on mouse out of the container
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
          {label}
        </label>
      )}
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {[...Array(max)].map((_, i) => {
          const starValue = i + 1;
          return (
            <button
              type="button"
              key={starValue}
              className="focus:outline-none"
              onMouseMove={() => setHovered(starValue)}
              onClick={() => setSelected(starValue)}
              aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
            >
              <span
                className={
                  (hovered ?? selected) >= starValue
                    ? "text-yellow-400 text-2xl"
                    : "text-neutral-300 dark:text-neutral-700 text-2xl"
                }
                aria-hidden="true"
              >
                ★
              </span>
            </button>
          );
        })}
        <input type="hidden" name={name} value={hovered ?? selected} />
      </div>
    </div>
  );
}
import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  fullWidth?: boolean;
};

export function Input({
  label,
  className = "",
  fullWidth = false,
  ...props
}: InputProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
          {label}
        </label>
      )}
      <input
        className={[
          "border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white rounded px-3 py-2 transition-colors",
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
}

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    fullWidth?: boolean;
  };

export function Textarea({
  label,
  className = "",
  fullWidth = false,
  ...props
}: TextareaProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={[
          "border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white rounded px-3 py-2 transition-colors",
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
}

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  fullWidth?: boolean;
};

export function Select({
  label,
  className = "",
  fullWidth = false,
  children,
  ...props
}: SelectProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
          {label}
        </label>
      )}
      <select
        className={[
          "border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white rounded px-3 py-2 transition-colors",
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
