"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthenticationError, confirmPasswordReset } from "@/services/auth.service";
import type { ResetPasswordFieldErrors } from "@/types/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordFieldErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function validate() {
    const errors: ResetPasswordFieldErrors = {};
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords don't match.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setAuthError(null);
    if (!token) {
      setAuthError("This reset link is missing its token. Request a new one.");
      return;
    }
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await confirmPasswordReset(token, password);
      setIsSuccess(true);
    } catch (error) {
      setAuthError(
        error instanceof AuthenticationError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <section aria-labelledby="reset-password-heading">
        <header className="mb-8 text-center">
          <h1 id="reset-password-heading" className="text-4xl font-semibold tracking-[-0.045em] text-[#17171c]">
            Password updated
          </h1>
          <p className="mt-3 text-sm text-[#696977]">
            Your password has been reset. Sign in with your new password.
          </p>
        </header>

        <button
          type="button"
          onClick={() => router.replace("/login")}
          className="flex w-full items-center justify-center rounded-xl bg-[#315bd8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2"
        >
          Go to sign in
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="reset-password-heading">
      <header className="mb-8 text-center">
        <h1 id="reset-password-heading" className="text-4xl font-semibold tracking-[-0.045em] text-[#17171c]">
          Choose a new password
        </h1>
        <p className="mt-2 text-sm text-[#696977]">Enter a new password for your account.</p>
      </header>

      {authError && (
        <div role="alert" aria-live="polite" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-[#34343c]">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="Create a secure password"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              if (fieldErrors.password) setFieldErrors((current) => ({ ...current, password: undefined }));
            }}
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {fieldErrors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-xs font-medium text-[#34343c]">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="Re-enter your password"
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (fieldErrors.confirmPassword) setFieldErrors((current) => ({ ...current, confirmPassword: undefined }));
            }}
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {fieldErrors.confirmPassword && (
            <p id="confirm-password-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315bd8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Reset password"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#696977]">
        <Link
          href="/login"
          className="rounded font-semibold text-[#315bd8] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]"
        >
          Back to sign in
        </Link>
      </p>
    </section>
  );
}
