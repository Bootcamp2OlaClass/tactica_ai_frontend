// Deliberately not "use client": app/layout.tsx (a Server Component) needs
// this same constant for its pre-hydration inline script. A plain (non-
// component) export from a "use client" module is not reliably usable from
// server-rendered code -- across that boundary it resolves to `undefined`,
// which silently broke localStorage.getItem(undefined) here before this
// was split out. Keeping the constant in a boundary-free module fixes it
// for both the server-rendered script and the client ThemeProvider.
export const THEME_STORAGE_KEY = "tactica-ai-theme";
