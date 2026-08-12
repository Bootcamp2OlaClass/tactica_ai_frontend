"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { confirmEmailVerification } from "@/services/auth.service";

type Status = "verifying" | "success" | "error";

export function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(() => (token ? "verifying" : "error"));

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    confirmEmailVerification(token)
      .then(() => {
        if (!cancelled) setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <section aria-labelledby="verify-email-heading">
      <header className="mb-8 text-center">
        <h1 id="verify-email-heading" className="text-4xl font-semibold tracking-[-0.045em] text-[#17171c]">
          {status === "verifying" && "Verifying your email…"}
          {status === "success" && "Email verified"}
          {status === "error" && "Verification failed"}
        </h1>

        <p className="mt-3 text-sm text-[#696977]">
          {status === "verifying" && "Hang tight while we confirm your email address."}
          {status === "success" && "Your email address has been confirmed."}
          {status === "error" && "This verification link is invalid or has expired. You can request a new one from your account."}
        </p>
      </header>

      {status !== "verifying" && (
        <Link
          href="/dashboard"
          className="flex w-full items-center justify-center rounded-xl bg-[#315bd8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#284fc4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-2"
        >
          Go to dashboard
        </Link>
      )}
    </section>
  );
}
