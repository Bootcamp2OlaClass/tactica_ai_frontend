import { authenticatedApiRequest } from "@/lib/api/client";
import { mapCalendarSyncState, type RawCalendarSyncState } from "@/lib/mappers/calendar";
import type { CalendarConnectionStatus, CalendarSyncState } from "@/types/calendar";

const BASE_PATH = "/api/v1/calendar";

export async function getCalendarAuthorizationUrl(): Promise<string> {
  const raw = await authenticatedApiRequest<{ authorization_url: string }>(
    `${BASE_PATH}/authorize`,
  );
  return raw.authorization_url;
}

export async function connectCalendar(code: string): Promise<void> {
  await authenticatedApiRequest<void>(`${BASE_PATH}/connect`, {
    method: "POST",
    json: { code },
  });
}

export async function disconnectCalendar(): Promise<void> {
  await authenticatedApiRequest<void>(`${BASE_PATH}/disconnect`, { method: "DELETE" });
}

export async function getCalendarStatus(): Promise<CalendarConnectionStatus> {
  return authenticatedApiRequest<CalendarConnectionStatus>(`${BASE_PATH}/status`);
}

export async function syncTaskToCalendar(taskId: number): Promise<CalendarSyncState> {
  const raw = await authenticatedApiRequest<RawCalendarSyncState>(
    `/api/v1/tasks/${taskId}/calendar-sync`,
    { method: "POST" },
  );
  return mapCalendarSyncState(raw);
}

export async function unsyncTaskFromCalendar(taskId: number): Promise<void> {
  await authenticatedApiRequest<void>(`/api/v1/tasks/${taskId}/calendar-sync`, {
    method: "DELETE",
  });
}
