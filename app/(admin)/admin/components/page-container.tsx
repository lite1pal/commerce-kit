import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export default function PageContainer({ children }: PageContainerProps) {
  return <main className="mx-auto w-full space-y-10">{children}</main>;
}
