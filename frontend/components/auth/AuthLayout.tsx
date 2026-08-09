import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { AuthBrandingPanel } from "./AuthBrandingPanel";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="grid min-h-screen lg:grid-cols-[3fr_2fr]">
        <AuthBrandingPanel />

        <main className="flex min-w-0 items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8] focus-visible:ring-offset-4"
                aria-label="Go to the Tactica AI home page"
              >
                <Image
                  src="/penguin/penguin-advisor.png"
                  alt="Tactica AI"
                  width={44}
                  height={44}
                  className="object-contain"

                />

                <span>
                  <span className="block text-base font-semibold tracking-[-0.02em] text-[#17171c]">
                    Tactica AI
                  </span>

                  <span className="mt-0.5 block text-xs font-normal text-[#696977]">
                    Your smarter Canvas.
                  </span>
                </span>
              </Link>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}