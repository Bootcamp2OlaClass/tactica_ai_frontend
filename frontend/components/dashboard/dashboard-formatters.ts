const dateOnlyFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const dateTimeFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function formatDate(value: string): string {
  return dateOnlyFormatter.format(new Date(value));
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function calendarDayDifference(value: string, now = new Date()): number {
  const target = new Date(value);
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.round((startTarget - startToday) / 86_400_000);
}

export function relativeDueDate(value: string): string {
  const days = calendarDayDifference(value);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days > 1) return `Due in ${days} days`;
  const overdueDays = Math.abs(days);
  return `${overdueDays} day${overdueDays === 1 ? "" : "s"} overdue`;
}
