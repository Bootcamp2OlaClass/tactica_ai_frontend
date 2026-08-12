"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { hasAuthenticationToken } from "@/lib/api/client";

// No external event fires when the token changes (it's plain localStorage,
// written only by our own login/logout code paths, not by other tabs), so
// there is nothing to subscribe to — the snapshot is read once per render.
function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // useSyncExternalStore (rather than useState+useEffect) reads this
  // browser-only value safely: it renders `false` during SSR/hydration and
  // only reflects the real token once mounted on the client, without an
  // effect body calling setState.
  const isAuthenticated = useSyncExternalStore(subscribe, hasAuthenticationToken, getServerSnapshot);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f4ff]" aria-busy="true" aria-live="polite">
        <span className="sr-only">Checking your session…</span>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#315bd8] border-t-transparent" aria-hidden="true" />
      </div>
    );
  }

  return <>{children}</>;
}
