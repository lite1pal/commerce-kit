import React from "react";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-3 sm:cursor-pointer text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed";
  const color =
    variant === "primary"
      ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
      : "bg-gray-200 text-black dark:bg-neutral-800 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700";
  const width = fullWidth ? "w-full" : "";

  return (
    <button
      type="button"
      disabled={disabled}
      className={[base, color, width, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
