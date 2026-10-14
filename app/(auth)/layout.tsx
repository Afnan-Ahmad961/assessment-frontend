// Shell for the signed-out pages (login, signup): a centered column on a muted background.
import type { ReactNode } from "react";

import { AppLogo } from "@/components/layout/app-logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <AppLogo />
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
