import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./ui/button";

type PageHeaderProps = {
  children: ReactNode;
  buttonHref?: string;
  buttonTitle?: string;
};

export default function PageHeader({
  children,
  buttonHref,
  buttonTitle,
}: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{children}</h1>

      {buttonHref && (
        <Link href={buttonHref}>
          <Button>{buttonTitle ?? "Button"}</Button>
        </Link>
      )}
    </header>
  );
}
