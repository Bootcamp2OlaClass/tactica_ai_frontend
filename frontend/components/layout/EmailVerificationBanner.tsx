"use client";

import { useCallback, useState } from "react";

import { useAsyncData } from "@/hooks/useAsyncData";
import { getApiErrorMessage } from "@/lib/api/client";
import { getCurrentUser, resendVerificationEmail } from "@/services/auth.service";

export function EmailVerificationBanner() {
  const { status, data } = useAsyncData(getCurrentUser, []);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResend = useCallback(async () => {
    setResendState("sending");
    setErrorMessage(null);
    try {
      await resendVerificationEmail();
      setResendState("sent");
    } catch (error) {
      setResendState("error");
      setErrorMessage(getApiErrorMessage(error));
    }
  }, []);

  if (status !== "success" || data.emailVerified) return null;

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/30 dark:text-amber-200 sm:px-8 lg:px-10"
    >
      <span>
        Please verify your email address ({data.email}) to secure your account.
        {resendState === "sent" && " Verification email sent — check your inbox."}
        {resendState === "error" && errorMessage && ` ${errorMessage}`}
      </span>

      <button
        type="button"
        onClick={handleResend}
        disabled={resendState === "sending" || resendState === "sent"}
        className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-700 dark:bg-transparent dark:text-amber-200 dark:hover:bg-amber-900/40"
      >
        {resendState === "sending" ? "Sending..." : resendState === "sent" ? "Sent" : "Resend email"}
      </button>
    </div>
  );
}
