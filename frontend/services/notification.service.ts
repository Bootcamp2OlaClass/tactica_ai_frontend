import { authenticatedApiRequest } from "@/lib/api/client";
import type { NotificationPreferences, NotificationType } from "@/types/notification";

const BASE_PATH = "/api/v1/notification-preferences";

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const raw = await authenticatedApiRequest<{ preferences: NotificationPreferences }>(BASE_PATH);
  return raw.preferences;
}

export async function updateNotificationPreference(
  type: NotificationType,
  enabled: boolean,
): Promise<NotificationPreferences> {
  const raw = await authenticatedApiRequest<{ preferences: NotificationPreferences }>(
    `${BASE_PATH}/${type}`,
    { method: "PUT", json: { enabled } },
  );
  return raw.preferences;
}
