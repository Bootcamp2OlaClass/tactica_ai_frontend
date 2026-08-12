"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { hasAuthenticationToken, refreshSession } from "@/lib/api/client";

type SessionStatus = "checking" | "authenticated" | "unauthenticated";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // The access token lives in memory only, so a hard page load always starts
  // with none — the real signal of whether a session exists is the httpOnly
  // refresh cookie, which JS can't read directly. A silent refresh on mount
  // is how we find out; until it resolves the app shell stays hidden.
  const [status, setStatus] = useState<SessionStatus>(() =>
    hasAuthenticationToken() ? "authenticated" : "checking",
  );

  useEffect(() => {
    if (status !== "checking") return;

    let cancelled = false;

    refreshSession().then((isAuthenticated) => {
      if (cancelled) return;
      setStatus(isAuthenticated ? "authenticated" : "unauthenticated");
    });

    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f4ff]" aria-busy="true" aria-live="polite">
        <span className="sr-only">Checking your session…</span>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#315bd8] border-t-transparent" aria-hidden="true" />
      </div>
    );
  }

  return <>{children}</>;
}
