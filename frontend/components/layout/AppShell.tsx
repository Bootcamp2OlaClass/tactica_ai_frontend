"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { EmailVerificationBanner } from "@/components/layout/EmailVerificationBanner";
import { logout } from "@/services/auth.service";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/semesters", label: "Semesters", icon: "🗓️" },
  { href: "/courses", label: "Courses", icon: "📚" },
  { href: "/tasks", label: "Tasks", icon: "✅" },
  { href: "/documents", label: "Documents", icon: "📄" },
  { href: "/chat", label: "Study Coach", icon: "💬" },
  { href: "/recovery-plan", label: "Recovery Plan", icon: "🧭" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary" className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
              active ? "bg-[#315bd8] text-white" : "text-[#454550] hover:bg-[#f6f4ff]"
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f4ff] text-[#17171c]">
      <header className="flex items-center justify-between border-b border-[#dedee9] bg-white px-4 py-3 sm:hidden">
        <span className="text-sm font-semibold text-[#315bd8]">Tactica AI</span>
        <button
          type="button"
          onClick={() => setIsMobileNavOpen((open) => !open)}
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          className="rounded-lg p-2 text-[#34343c] hover:bg-[#f6f4ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]"
        >
          {isMobileNavOpen ? "✕" : "☰"}
        </button>
      </header>

      {isMobileNavOpen && (
        <div id="mobile-nav" className="border-b border-[#dedee9] bg-white px-4 py-4 sm:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setIsMobileNavOpen(false)} />
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#454550] hover:bg-[#f6f4ff]"
          >
            <span aria-hidden="true">↪</span>
            Sign out
          </button>
        </div>
      )}

      <EmailVerificationBanner />

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#dedee9] bg-white px-4 py-6 sm:flex">
          <div className="px-2 text-sm font-semibold text-[#315bd8]">Tactica AI</div>

          <div className="mt-8 flex-1">
            <NavLinks pathname={pathname} />
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#454550] transition hover:bg-[#f6f4ff]"
          >
            <span aria-hidden="true">↪</span>
            Sign out
          </button>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
