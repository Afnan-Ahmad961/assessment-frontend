"use client";
// Header button that switches between dark and light theme.
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Icons are switched with CSS, so the server render and first client render always match. */}
      <SunIcon className="hidden dark:block" aria-hidden />
      <MoonIcon className="dark:hidden" aria-hidden />
    </Button>
  );
}
