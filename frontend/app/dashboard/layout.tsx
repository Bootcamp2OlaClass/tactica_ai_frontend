import type { Metadata } from "next";

export const metadata: Metadata = { title: "Academic dashboard" };

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
