"use client";

import { useCallback, useState } from "react";

import { getNotificationPreferences, updateNotificationPreference } from "@/services/notification.service";
import type { NotificationType } from "@/types/notification";

import { useAsyncData } from "./useAsyncData";

export function useNotificationPreferences() {
  const result = useAsyncData(() => getNotificationPreferences(), []);
  const [pendingType, setPendingType] = useState<NotificationType | null>(null);

  const setEnabled = useCallback(
    (type: NotificationType, enabled: boolean) => {
      setPendingType(type);
      return updateNotificationPreference(type, enabled).finally(() => {
        setPendingType(null);
        result.reload();
      });
    },
    [result],
  );

  return { ...result, pendingType, setEnabled };
}
