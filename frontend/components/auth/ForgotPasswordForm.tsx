"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { requestPasswordReset } from "@/services/auth.service";
import type { ForgotPasswordFieldErrors } from "@/types/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function validate() {
    if (!email.trim()) {
      setFieldErrors({ email: "Email is required." });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors({ email: "Enter a valid email address." });
      return false;
    }
    setFieldErrors({});
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !validate()) return;

    try {
      setIsSubmitting(true);
      await requestPasswordReset(email.trim());
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <section aria-labelledby="forgot-password-heading">
        <header className="mb-8 text-center">
          <h1 id="forgot-password-heading" className="text-4xl font-semibold tracking-[-0.045em] text-[#17171c]">
            Check your email
          </h1>
          <p className="mt-3 text-sm text-[#696977]">
            If an account exists for <span className="font-medium text-[#34343c]">{email}</span>, we&apos;ve sent a
            link to reset your password.
          </p>
        </header>

        <Link
          href="/login"
          className="flex w-full items-center justify-center rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-semibold text-[#34343c] transition hover:bg-[#f6f4ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]"
        >
          Back to sign in
        </Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="forgot-password-heading">
      <header className="mb-8 text-center">
        <h1 id="forgot-password-heading" className="text-4xl font-semibold tracking-[-0.045em] text-[#17171c]">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-[#696977]">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-[#34343c]">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            autoComplete="email"
            disabled={isSubmitting}
            placeholder="you@university.edu"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) setFieldErrors({});
            }}
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315bd8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
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
