// Shell for signed-in pages: a header with the logo, theme toggle, and user menu, and a full-height content area.
// The user menu reads the session, so it streams in behind <Suspense> while the rest of the shell
// renders immediately.
import { Suspense, type ReactNode } from "react";

import { AppLogo } from "@/components/layout/app-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu, UserMenuSkeleton } from "@/components/layout/user-menu";
import { QueryProvider } from "@/components/providers/query-provider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6">
        <AppLogo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Suspense fallback={<UserMenuSkeleton />}>
            <UserMenu />
          </Suspense>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">
        <QueryProvider>{children}</QueryProvider>
      </main>
    </div>
  );
}
