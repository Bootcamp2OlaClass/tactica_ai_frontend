"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  AuthenticationError,
  login,
} from "@/services/auth.service";

import type { LoginFieldErrors } from "@/types/auth";

function getSafeRedirect(redirect: string | null) {
  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//")
  ) {
    return redirect;
  }

  return "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [fieldErrors, setFieldErrors] =
    useState<LoginFieldErrors>({});

  const [authError, setAuthError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function validateForm() {
    const errors: LoginFieldErrors = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setAuthError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        email,
        password,
        rememberMe,
      });

      const redirect = getSafeRedirect(
        searchParams.get("redirect"),
      );

      router.replace(redirect);
      router.refresh();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        setAuthError(error.message);
      } else {
        setAuthError(
          "Something went wrong while signing in. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="login-heading">
      <header className="mb-8 text-center">
        <Image
          src="/penguin/penguin-advisor.png"
          alt=""
          width={112}
          height={112}
          className="mx-auto mb-4 h-28 w-28 object-contain"
          aria-hidden="true"
          priority
        />

        <h1
          id="login-heading"
          className="text-4xl font-semibold tracking-[-0.045em] text-[#17171c]"
        >
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-[#696977]">
          Sign in to your account to continue.
        </p>
      </header>

      {authError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {authError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-[#34343c]"
          >
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
            aria-describedby={
              fieldErrors.email
                ? "email-error"
                : undefined
            }
            onChange={(event) => {
              setEmail(event.target.value);

              if (fieldErrors.email) {
                setFieldErrors((current) => ({
                  ...current,
                  email: undefined,
                }));
              }

              if (authError) {
                setAuthError(null);
              }
            }}
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {fieldErrors.email && (
            <p
              id="email-error"
              className="mt-1.5 text-xs text-red-600"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="text-xs font-medium text-[#34343c]"
            >
              Password
            </label>

            <span className="text-xs text-[#696977]">
              Forgot password?
            </span>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            autoComplete="current-password"
            disabled={isSubmitting}
            placeholder="••••••••"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password
                ? "password-error"
                : undefined
            }
            onChange={(event) => {
              setPassword(event.target.value);

              if (fieldErrors.password) {
                setFieldErrors((current) => ({
                  ...current,
                  password: undefined,
                }));
              }

              if (authError) {
                setAuthError(null);
              }
            }}
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {fieldErrors.password && (
            <p
              id="password-error"
              className="mt-1.5 text-xs text-red-600"
            >
              {fieldErrors.password}
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#696977]">
          <input
            type="checkbox"
            checked={rememberMe}
            disabled={isSubmitting}
            onChange={(event) =>
              setRememberMe(event.target.checked)
            }
            className="h-4 w-4 rounded border-[#cfd2e3] accent-[#315bd8]"
          />

          Remember me
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315bd8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Signing in..."
            : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#dedee9]" />

        <span className="text-xs text-[#696977]">
          or
        </span>

        <div className="h-px flex-1 bg-[#dedee9]" />
      </div>

      <button
        type="button"
        disabled
        title="Google sign-in will be enabled when OAuth integration is available."
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-semibold text-[#34343c] opacity-60"
      >
        <span aria-hidden="true">G</span>
        Continue with Google
      </button>

      <p className="mt-7 text-center text-sm text-[#696977]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="rounded font-semibold text-[#315bd8] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]"
        >
          Register
        </Link>
      </p>
    </section>
  );
}