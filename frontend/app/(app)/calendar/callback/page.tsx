"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api/client";
import { connectCalendar } from "@/services/calendar.service";

function CalendarCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const code = searchParams.get("code");
    // Both branches resolve through the same .then()/.catch() chain (not
    // a direct setState call in the effect body) -- matches
    // hooks/useAsyncData.ts's pattern, see hooks/useRoadmap.ts for the
    // fuller explanation of why this shape is required here.
    const run = code
      ? connectCalendar(code)
      : Promise.reject(
          new Error("Google didn't return an authorization code. Please try connecting again."),
        );

    run
      .then(() => {
        showToast("Google Calendar connected.", "success");
        router.replace("/calendar");
      })
      .catch((err: unknown) => {
        setError(getApiErrorMessage(err, "Unable to finish connecting Google Calendar."));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}

export default function CalendarCallbackPage() {
  return (
    <Suspense fallback={<Skeleton className="h-24 w-full rounded-2xl" />}>
      <CalendarCallbackContent />
    </Suspense>
  );
}
