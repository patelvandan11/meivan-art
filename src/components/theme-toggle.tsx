"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="relative h-9 w-9 rounded-full border border-border/50 text-muted-foreground"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-9 w-9 rounded-full border border-border/60 bg-secondary/50 text-foreground transition-all duration-300 hover:bg-secondary hover:border-terracotta/40 dark:bg-card dark:border-white/10 dark:hover:border-terracotta/60 dark:shadow-[0_0_15px_rgba(224,138,107,0.2)]"
      aria-label={isDark ? "Switch to daylight mode" : "Switch to midnight mode"}
      title={isDark ? "☀️ Switch to Day mode" : "🌙 Switch to Night mode"}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 text-amber-600 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 text-amber-300 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
