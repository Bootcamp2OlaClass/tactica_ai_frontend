import type { CalendarSyncState, CalendarSyncStatus } from "@/types/calendar";

export interface RawCalendarSyncState {
  task_id: number;
  provider_event_id: string | null;
  sync_status: CalendarSyncStatus;
  sync_error: string | null;
  last_synced_at: string | null;
}

export function mapCalendarSyncState(raw: RawCalendarSyncState): CalendarSyncState {
  return {
    taskId: raw.task_id,
    providerEventId: raw.provider_event_id,
    syncStatus: raw.sync_status,
    syncError: raw.sync_error,
    lastSyncedAt: raw.last_synced_at,
  };
}
