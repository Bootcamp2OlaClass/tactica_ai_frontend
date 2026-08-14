import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { THEME_STORAGE_KEY } from "@/lib/theme";

import "./globals.css";

// Runs before hydration so the correct theme applies on first paint --
// without this, the page would flash light (the server-rendered default)
// even when the user picked Dark or their OS prefers dark.
const SET_INITIAL_THEME_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    var resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    if (resolved === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tactica AI",
    template: "%s | Tactica AI",
  },
  description:
    "Courses, deadlines, notes, study plans, and AI guidance—all organized in one workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)]">
        <Script id="set-initial-theme" strategy="beforeInteractive">
          {SET_INITIAL_THEME_SCRIPT}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}