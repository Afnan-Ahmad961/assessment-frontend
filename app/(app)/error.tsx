"use client";
// Shown when a signed-in page fails to load, e.g. the API is unreachable.
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function AppError({ retry }: ErrorPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-semibold">This page couldn&apos;t load</h1>
        <p className="text-sm text-muted-foreground">We couldn&apos;t reach the server. Check your connection and try again.</p>
      </div>
      <Button variant="outline" onClick={retry}>
        Try again
      </Button>
    </div>
  );
}
