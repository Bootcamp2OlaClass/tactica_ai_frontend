export type CalendarSyncStatus = "SYNCED" | "FAILED";

export interface CalendarConnectionStatus {
  connected: boolean;
}

// Matches app/schemas/calendar.py's CalendarSyncResponse exactly.
export interface CalendarSyncState {
  taskId: number;
  providerEventId: string | null;
  syncStatus: CalendarSyncStatus;
  syncError: string | null;
  lastSyncedAt: string | null;
}
