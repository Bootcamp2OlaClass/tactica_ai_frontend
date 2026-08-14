"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/Skeleton";

/** Notification preferences moved into Settings -> Notifications; this
 * route stays alive (rather than 404ing) for old links/bookmarks. */
export default function NotificationPreferencesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings?tab=notifications");
  }, [router]);

  return <Skeleton className="h-64 w-full rounded-2xl" />;
}
