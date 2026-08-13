"use client";

import { getCalendarStatus } from "@/services/calendar.service";

import { useAsyncData } from "./useAsyncData";

export function useCalendarConnection() {
  return useAsyncData(() => getCalendarStatus(), []);
}
