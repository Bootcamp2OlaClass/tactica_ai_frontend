type BadgeTone = "neutral" | "blue" | "green" | "amber" | "red" | "purple";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-[#f0f0f5] text-[#454550]",
  blue: "bg-[#dce4ff] text-[#284fc4]",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-700",
  purple: "bg-violet-100 text-violet-800",
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
