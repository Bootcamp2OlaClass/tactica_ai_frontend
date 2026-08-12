"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { setAuthenticationToken } from "@/lib/api/client";
import {
  AuthenticationError,
  register,
} from "@/services/auth.service";

import type { RegisterFieldErrors } from "@/types/auth";

export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<RegisterFieldErrors>({});

  const [authError, setAuthError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function validateForm() {
    const errors: RegisterFieldErrors = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
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

      const { accessToken } = await register({
        fullName: fullName.trim(),
        email,
        password,
      });

      setAuthenticationToken(accessToken);

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        setAuthError(error.message);
      } else {
        setAuthError(
          "Something went wrong while creating your account. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="register-heading">
      <header className="mb-8 text-center">
        <Image
          src="/penguin/penguin-advisor.png"
          alt=""
          width={96}
          height={96}
          className="mx-auto h-24 w-24 object-contain"
          aria-hidden="true"
          priority
        />

        <h1
          id="register-heading"
          className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-[#17171c]"
        >
          Create your account
        </h1>

        <p className="mt-2 text-sm font-normal leading-6 text-[#696977]">
          Start organizing your academic life in one intelligent workspace.
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

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="full-name"
            className="block text-xs font-medium text-[#34343c]"
          >
            Full name
          </label>

          <input
            id="full-name"
            name="fullName"
            type="text"
            value={fullName}
            autoComplete="name"
            disabled={isSubmitting}
            placeholder="Nhi Nguyen"
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={fieldErrors.fullName ? "full-name-error" : undefined}
            onChange={(event) => {
              setFullName(event.target.value);
              if (fieldErrors.fullName) {
                setFieldErrors((current) => ({ ...current, fullName: undefined }));
              }
              if (authError) setAuthError(null);
            }}
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-normal text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {fieldErrors.fullName && (
            <p id="full-name-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="block text-xs font-medium text-[#34343c]"
          >
            Email address
          </label>

          <input
            id="register-email"
            name="email"
            type="email"
            value={email}
            autoComplete="email"
            disabled={isSubmitting}
            placeholder="you@university.edu"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }
              if (authError) setAuthError(null);
            }}
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-normal text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {fieldErrors.email && (
            <p id="register-email-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="block text-xs font-medium text-[#34343c]"
          >
            Password
          </label>

          <input
            id="register-password"
            name="password"
            type="password"
            value={password}
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="Create a secure password"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "register-password-error" : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              if (fieldErrors.password) {
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }
              if (authError) setAuthError(null);
            }}
            className="mt-2 w-full rounded-xl border border-[#cfd2e3] bg-white px-4 py-3 text-sm font-normal text-[#17171c] outline-none transition placeholder:text-[#92929e] hover:border-[#aeb3cf] focus:border-[#315bd8] focus:ring-4 focus:ring-[#315bd8]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {fieldErrors.password && (
            <p id="register-password-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#315bd8] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
          {!isSubmitting && <span aria-hidden="true">→</span>}
        </button>
      </form>

      <p className="mt-7 text-center text-sm font-normal text-[#696977]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="rounded font-semibold text-[#315bd8] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
