"use client";

import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { getApiErrorMessage } from "@/lib/api/client";
import type { NotificationType } from "@/types/notification";

const NOTIFICATION_TYPES: { type: NotificationType; label: string; description: string }[] = [
  { type: "ASSIGNMENT_DUE", label: "Assignment due soon", description: "An assignment is due within 24 hours." },
  { type: "EXAM_COUNTDOWN", label: "Exam countdown", description: "An exam or quiz is due within 24 hours." },
  { type: "OVERDUE_TASK", label: "Overdue task", description: "A task has passed its due date and isn't complete." },
  { type: "WEEKLY_PLAN", label: "Weekly plan digest", description: "A summary of your week's plan." },
  { type: "RECOVERY_PLAN", label: "Recovery plan alert", description: "Your recovery plan changed significantly." },
];

function ToggleSwitch({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-60 ${
        checked ? "bg-[#315bd8]" : "bg-[#dedee9]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function NotificationPreferencesPage() {
  const { data, status, error, reload, pendingType, setEnabled } = useNotificationPreferences();
  const { showToast } = useToast();

  function handleToggle(type: NotificationType, currentlyEnabled: boolean) {
    setEnabled(type, !currentlyEnabled).catch((err: unknown) => {
      showToast(getApiErrorMessage(err, "Unable to update this preference."), "error");
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Notifications"
        description="Choose which email reminders you want to receive. All are on by default."
      />

      {status === "loading" && <Skeleton className="h-64 w-full rounded-2xl" />}
      {status === "error" && <ErrorState message={error ?? "Unable to load your preferences."} onRetry={reload} />}

      {status === "success" && (
        <div className="divide-y divide-[#dedee9] rounded-2xl border border-[#dedee9] bg-white">
          {NOTIFICATION_TYPES.map(({ type, label, description }) => {
            const enabled = data[type];
            return (
              <div key={type} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-[#17171c]">{label}</p>
                  <p className="mt-0.5 text-xs text-[#696977]">{description}</p>
                </div>
                <ToggleSwitch
                  checked={enabled}
                  disabled={pendingType === type}
                  onChange={() => handleToggle(type, enabled)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
