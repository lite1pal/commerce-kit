import { redirect } from "next/navigation";
import Link from "next/link";
import { adminLogout } from "./login/actions";
import { getCurrentUser } from "../../(storefront)/auth/actions";

import "../../globals.css";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const isAdmin = user && user.role === "ADMIN";

  if (!isAdmin) redirect("/");

  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <html lang="en" className={isDark ? "dark" : ""}>
      <body>
        <SidebarProvider>
          <AppSidebar user={user} />
          <main className="w-full mx-auto">
            <SidebarTrigger />
            <div className="mx-auto w-full max-w-7xl px-6 py-8">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
