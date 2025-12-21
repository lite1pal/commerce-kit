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
      ? "bg-black text-white hover:opacity-80"
      : "bg-gray-200 text-black hover:bg-gray-300";
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
