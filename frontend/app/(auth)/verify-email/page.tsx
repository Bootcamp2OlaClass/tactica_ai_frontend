import { Suspense } from "react";

import { VerifyEmailStatus } from "@/components/auth/VerifyEmailStatus";

export const metadata = {
  title: "Verify email",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailStatus />
    </Suspense>
  );
}
