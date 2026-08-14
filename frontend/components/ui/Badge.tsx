type BadgeTone = "neutral" | "blue" | "green" | "amber" | "red" | "purple";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-[#f0f0f5] text-[#454550] dark:bg-[#26262f] dark:text-[#c7c7d1]",
  blue: "bg-[#dce4ff] text-[#284fc4] dark:bg-[#1e2a56] dark:text-[#a9bdff]",
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  purple: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
