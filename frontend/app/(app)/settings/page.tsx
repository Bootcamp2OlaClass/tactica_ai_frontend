"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField, formFieldInputClassName } from "@/components/ui/FormField";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/ToastProvider";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { getApiErrorMessage } from "@/lib/api/client";
import { getCurrentUser, updateProfile } from "@/services/auth.service";
import type { NotificationType } from "@/types/notification";

const TABS = [
  { key: "profile" as const, label: "Profile" },
  { key: "notifications" as const, label: "Notifications" },
  { key: "appearance" as const, label: "Appearance" },
];

const NOTIFICATION_TYPES: { type: NotificationType; label: string; description: string }[] = [
  { type: "ASSIGNMENT_DUE", label: "Assignment due soon", description: "An assignment is due within 24 hours." },
  { type: "EXAM_COUNTDOWN", label: "Exam countdown", description: "An exam or quiz is due within 24 hours." },
  { type: "OVERDUE_TASK", label: "Overdue task", description: "A task has passed its due date and isn't complete." },
  { type: "WEEKLY_PLAN", label: "Weekly plan digest", description: "A summary of your week's plan." },
  { type: "RECOVERY_PLAN", label: "Recovery plan alert", description: "Your recovery plan changed significantly." },
];

const THEME_OPTIONS: { value: Theme; label: string; description: string }[] = [
  { value: "system", label: "System", description: "Match your device's appearance." },
  { value: "light", label: "Light", description: "Always use the light theme." },
  { value: "dark", label: "Dark", description: "Always use the dark theme." },
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
        checked ? "bg-[#315bd8] dark:bg-[#4d6fe0]" : "bg-[#dedee9] dark:bg-[#3a3a48]"
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

function ProfileForm({ email, initialFullName, onSaved }: { email: string; initialFullName: string; onSaved: () => void }) {
  const { showToast } = useToast();
  // Lazy-initialized from the loaded user, not synced via an effect --
  // this component only mounts once `data` exists (see ProfileTab below),
  // so there's no "arrives later" case to reconcile.
  const [fullName, setFullName] = useState(initialFullName);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      await updateProfile(fullName);
      showToast("Profile updated.", "success");
      onSaved();
    } catch (err) {
      setSaveError(getApiErrorMessage(err, "Unable to update your profile."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
      {saveError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-300">
          {saveError}
        </div>
      )}

      <FormField id="settings-email" label="Email">
        <input id="settings-email" value={email} disabled readOnly className={formFieldInputClassName} />
      </FormField>

      <FormField id="settings-full-name" label="Name" required>
        <input
          id="settings-full-name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          disabled={isSaving}
          className={formFieldInputClassName}
        />
      </FormField>

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isSaving} disabled={fullName.trim().length === 0}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function ProfileTab() {
  const { data, status, error, reload } = useAsyncData(getCurrentUser, []);

  if (status === "loading") return <Skeleton className="h-48 w-full max-w-md rounded-2xl" />;
  if (status === "error") return <ErrorState message={error ?? "Unable to load your profile."} onRetry={reload} />;

  return <ProfileForm email={data.email} initialFullName={data.fullName} onSaved={reload} />;
}

function NotificationsTab() {
  const { data, status, error, reload, pendingType, setEnabled } = useNotificationPreferences();
  const { showToast } = useToast();

  function handleToggle(type: NotificationType, currentlyEnabled: boolean) {
    setEnabled(type, !currentlyEnabled).catch((err: unknown) => {
      showToast(getApiErrorMessage(err, "Unable to update this preference."), "error");
    });
  }

  if (status === "loading") return <Skeleton className="h-64 w-full max-w-2xl rounded-2xl" />;
  if (status === "error") return <ErrorState message={error ?? "Unable to load your preferences."} onRetry={reload} />;

  return (
    <div className="max-w-2xl divide-y divide-[#dedee9] rounded-2xl border border-[#dedee9] bg-white dark:divide-[#2d2d38] dark:border-[#2d2d38] dark:bg-[#1b1b23]">
      {NOTIFICATION_TYPES.map(({ type, label, description }) => {
        const enabled = data[type];
        return (
          <div key={type} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-[#17171c] dark:text-[#f2f2f5]">{label}</p>
              <p className="mt-0.5 text-xs text-[#696977] dark:text-[#9797a6]">{description}</p>
            </div>
            <ToggleSwitch checked={enabled} disabled={pendingType === type} onChange={() => handleToggle(type, enabled)} />
          </div>
        );
      })}
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Theme" className="max-w-md space-y-2">
      {THEME_OPTIONS.map((option) => {
        const selected = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(option.value)}
            className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition ${
              selected
                ? "border-[#315bd8] bg-[#f6f4ff] dark:border-[#6a8dff] dark:bg-[#1e2a56]"
                : "border-[#dedee9] bg-white hover:border-[#aeb3cf] dark:border-[#2d2d38] dark:bg-[#1b1b23] dark:hover:border-[#4c4c5c]"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-[#17171c] dark:text-[#f2f2f5]">{option.label}</p>
              <p className="mt-0.5 text-xs text-[#696977] dark:text-[#9797a6]">{option.description}</p>
            </div>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                selected ? "border-[#315bd8] dark:border-[#6a8dff]" : "border-[#cfd2e3] dark:border-[#4c4c5c]"
              }`}
            >
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#315bd8] dark:bg-[#6a8dff]" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>(
    initialTab === "notifications" || initialTab === "appearance" ? initialTab : "profile",
  );

  function handleTabChange(key: (typeof TABS)[number]["key"]) {
    setActiveTab(key);
    router.replace(`/settings?tab=${key}`, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Settings" description="Manage your profile, notifications, and appearance." />

      <Tabs tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />

      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "appearance" && <AppearanceTab />}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
      <SettingsPageContent />
    </Suspense>
  );
}
