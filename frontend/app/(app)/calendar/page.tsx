"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { useCalendarConnection } from "@/hooks/useCalendarConnection";
import { getApiErrorMessage } from "@/lib/api/client";
import { disconnectCalendar, getCalendarAuthorizationUrl } from "@/services/calendar.service";
import { useState } from "react";

export default function CalendarPage() {
  const status = useCalendarConnection();
  const { showToast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  async function handleConnect() {
    setIsConnecting(true);
    try {
      const url = await getCalendarAuthorizationUrl();
      window.location.href = url;
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to start Google Calendar connection."), "error");
      setIsConnecting(false);
    }
  }

  async function handleDisconnect() {
    setIsDisconnecting(true);
    try {
      await disconnectCalendar();
      showToast("Google Calendar disconnected.", "success");
      status.reload();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to disconnect."), "error");
    } finally {
      setIsDisconnecting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Calendar"
        description="Connect Google Calendar to sync your deadlines and exams as events."
      />

      {status.status === "loading" && <Skeleton className="h-24 w-full rounded-2xl" />}
      {status.status === "error" && (
        <ErrorState message={status.error ?? "Unable to load calendar status."} onRetry={status.reload} />
      )}

      {status.status === "success" && (
        <div className="rounded-2xl border border-[#dedee9] bg-white p-6">
          <div className="flex items-center gap-2">
            <Badge tone={status.data.connected ? "green" : "neutral"}>
              {status.data.connected ? "Connected" : "Not connected"}
            </Badge>
          </div>

          <p className="mt-3 text-sm text-[#696977]">
            {status.data.connected
              ? "Your Google Calendar is connected. Use \"Add to calendar\" on any task to sync it."
              : "Connect your Google Calendar to sync task deadlines as events. Re-running a sync never creates duplicate events, and deleting a task removes its synced event too."}
          </p>

          <div className="mt-5">
            {status.data.connected ? (
              <Button variant="danger" onClick={handleDisconnect} isLoading={isDisconnecting}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleConnect} isLoading={isConnecting}>
                Connect Google Calendar
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
